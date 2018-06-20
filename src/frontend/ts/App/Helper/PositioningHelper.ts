
export class PackageItem {

    private _top : number

    private _left : number

    margin : { x : number, y : number}

    shouldRearrange : boolean
    
    originElement : HTMLElement

	constructor(element: HTMLElement, shouldRearrange: boolean = true) {
        this._top = 0;
        this._left = 0;

        this.margin = {
            x: element.clientWidth / 2,
            y: element.clientHeight / 2
        };

		this.originElement = element; 
		this.shouldRearrange = shouldRearrange;
	}
	
	set top(value: number) {
		this._top = value;
	}
	get top() {
		return this._top;
	}
	
	set left(value: number) {
		this._left = value;
	}
	get left() {
		return this._left;
	}
	
	get right() {
		return this.left + this.width;
	}
	get bottom() {
		return this.top + this.height;
	}
	
	get width() {
		return this.originElement.clientWidth;
	}
	get height() {
		return this.originElement.clientHeight;
	}
    
    collides(item: PackageItem, checkOpposite : boolean = true) : boolean {
        let horizontalInBetweenItem = (x: number) => {
            let left = this.left - this.margin.x;
            let right = this.right + this.margin.x;

            return x > left && x < right; 
        }
        let verticalInBetweenItem = (y: number) => {
            let top = this.top - this.margin.y;
            let bottom = this.bottom + this.margin.y;

            return y > top && y < bottom; 
        };

        let coordinatesAreInItem = (x: number, y: number) => {
            return horizontalInBetweenItem(x) && verticalInBetweenItem(y); 
        };

        if (checkOpposite) {
            if (item.collides(this, false)) {
                return true;
            }
        }

        let topLeftCorner = coordinatesAreInItem(item.left, item.top);
        let topRightCorner = coordinatesAreInItem(item.right, item.top);
        let bottomLeftCorner = coordinatesAreInItem(item.left, item.bottom);
        let bottomRightCorner = coordinatesAreInItem(item.right, item.bottom);

        return topLeftCorner || topRightCorner || bottomLeftCorner || bottomRightCorner;
    }
}

export interface PackagerOptions {
    maxTriesPerItem? : number
    blockingElements? : HTMLElement[]
    debug? : boolean
}

export default abstract class Packager {
    
    items : PackageItem[]

    container : HTMLElement

    options : PackagerOptions

    private _lastAddedItem : PackageItem|null
    
	constructor(container : HTMLElement, options: PackagerOptions) {
		this.items = [];
        this.container = container;
        this._lastAddedItem = null;

        this.options = Object.assign({
            maxTriesPerItem: 1000,
            blockingElements: [],
            debug: false
        }, options);
		
		for (let element of this.options.blockingElements as HTMLElement[]) {
			let item = new PackageItem(element, false);
			item.top = element.offsetTop;
            item.left = element.offsetLeft;
            item.margin = { x: 0, y: 0 }
			this.items.push(item);
		}
	}
	
	abstract getPosition(maxHeight: number, maxWidth: number) : { top: number, left: number}
	
	addItems(elements: HTMLElement[]) {
		for (let element of elements) {
			this.addItem(element);
        }
        
        return this.items;
	}
	
	addItem(element: HTMLElement) : PackageItem {
		let item = new PackageItem(element);
        
        this._assignCollisionFreePosition(item, this.items);
        
        this._lastAddedItem = item;
        this.items.push(item);

        item.originElement.classList.add('packageItem');

        return item;
    }
    
    private _assignCollisionFreePosition(item: PackageItem, otherItems: PackageItem[]) {
        let attempCounter = 0;
        let hasCollision = true;
		do {
            attempCounter++

            this._setValidItemPosition(
                this.getPosition(this.container.clientHeight, this.container.clientWidth),
                item
            );
            
            hasCollision = this._collides(item, otherItems);

            let maxTries = this.options.maxTriesPerItem as number;
            if (attempCounter >= maxTries) {
                hasCollision = false;
                console.warn('%cTried repositioning more than allowed!\nChange options.maxTriesPerItem to exceed better results.', 'font-size: x-large');
            }

        } while(hasCollision)
        
        if (this.options.debug) {
            console.log(`Attempts per Item needed: ${attempCounter}`);
        }
    };
    
    private _setValidItemPosition(position : { top : number, left : number }, item : PackageItem) {
        item.top = position.top < 0 ? 0 : position.top;
        item.left = position.left < 0 ? 0 : position.left;
        item.top = position.top > item.height + item.margin.y ? position.top - item.height : position.top;
        item.left = position.left > item.width + item.margin.x ? position.left - item.width : position.left;
    }

	private _collides(item : PackageItem, blockingItems : PackageItem[]) {
		for (let blocker of blockingItems) {
            if (item === blocker) {
                continue;
            }

			if (blocker.collides(item)) {
                return true
            }
		}
		
		return false;
    }
    
    reset() {
		for (let item of this.items) {
			if (!item.shouldRearrange || !item.originElement) {
                    continue;
            }

            item.originElement.classList.remove('packageItem__is-positioned')
		}
    }
    
	layout() {
		for (let item of this.items) {
			if (!item.shouldRearrange || !item.originElement) {
					continue;
            }
			
            item.originElement.classList.add('packageItem__is-positioned')

			item.originElement.style.top = item.top +'px';
			item.originElement.style.left = item.left +'px';
        }
        
        if (this.options.debug) {
            this.debugItemPositions();
        }
    }

    debugItemPositions() {
        for (let element of this.container.querySelectorAll('.packager-DEBUG')) {
            element.remove();
        }

        for (let item of this.items) {
            let debugElement = document.createElement('div');
            debugElement.className = 'packager-DEBUG';
            debugElement.style.setProperty('opacity', `0.5`)
            debugElement.style.setProperty('position', `absolute`)
            debugElement.style.setProperty('box-sizing', `content-box`)
            debugElement.style.setProperty('border', `solid #00ff00`)
            debugElement.style.setProperty('width', `${item.width}px`)
            debugElement.style.setProperty('height', `${item.height}px`)
            debugElement.style.setProperty('top', `${item.top - item.margin.y}px`)
            debugElement.style.setProperty('left', `${item.left - item.margin.x}px`);
            debugElement.style.setProperty('background-color', `#FF00FF`)
            debugElement.style.setProperty('border-top-width', `${item.margin.y}px`)
            debugElement.style.setProperty('border-bottom-width', `${item.margin.y}px`)
            debugElement.style.setProperty('border-left-width', `${item.margin.x}px`)
            debugElement.style.setProperty('border-right-width', `${item.margin.x}px`)

            this.container.appendChild(debugElement);
        }
    }
}

export class RandomPackager extends Packager {
    
    positionIndex : number

    positionRanges : { minWidth: number, maxWidth: number, minHeight: number, maxHeight: number }[]

    constructor(container : HTMLElement, options: PackagerOptions) {
        super(container, options);

        let endWidth = this.container.clientWidth;
        let middleWidth = Math.round(this.container.clientWidth / 2);
        let endHeight = this.container.clientHeight;
        let middleHeight = Math.round(this.container.clientHeight / 2);

        this.positionIndex = 0;
        this.positionRanges = [
            {
                minWidth: middleWidth,
                maxWidth: endWidth,
                minHeight: middleHeight,
                maxHeight: endHeight,
            },
            {
                minWidth: 0,
                maxWidth: middleWidth,
                minHeight: middleHeight,
                maxHeight: endHeight,
            },
            {
                minWidth: 0,
                maxWidth: middleWidth,
                minHeight: 0,
                maxHeight: middleHeight,
            },
            {
                minWidth: middleWidth,
                maxWidth: endWidth,
                minHeight: 0,
                maxHeight: middleHeight,
            },
        ];
    }

    getPosition(maxHeight: number, maxWidth: number) : { top: number; left: number; } {
        let range = this.positionRanges[this.positionIndex];

		return {
            top: Math.round(range.minHeight + ((range.maxHeight - range.minHeight)*(Math.random() % 1))),
            left: Math.round(range.minWidth + ((range.maxWidth - range.minWidth)*(Math.random() % 1))),
        }
    }
    
    addItem(element: HTMLElement) {
        let item = super.addItem(element);
        
        this.positionIndex++;
        if (this.positionIndex >= this.positionRanges.length) {
            this.positionIndex = 0;
        }

        return item;
    }
}