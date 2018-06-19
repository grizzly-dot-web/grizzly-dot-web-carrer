export class PackageItem {

    private _top : number

    private _left : number

    shouldRearrange : boolean
    
    originElement : HTMLElement

	constructor(element: HTMLElement, shouldRearrange: boolean = true) {
        this._top = 0;
        this._left = 0;
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
	
	collides(items : PackageItem[]) {
        let collision = false;
		for (let blocker of items) {
			
			if (this.left > blocker.left && this.left < blocker.right && this.top > blocker.top && this.top < blocker.bottom) {
                collision = true;
            }
			
			if (this.right > blocker.left && this.right < blocker.right && this.bottom > blocker.top && this.bottom < blocker.bottom) {
                collision = true;
            }
		}
		
		return collision;
	}
	
}

export interface PackagerOptions {
    maxTriesPerItem? : number
    blockingElements? : HTMLElement[]
    debug? : boolean
}

export default class Packager {
    
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
            
			this.items.push(item);
		}
	}
	
	_getPosition(maxHeight: number, maxWidth: number) : { top: number, left: number} {
		return {
            top: Math.round(maxHeight * (Math.random() % 1)),
            left: Math.round(maxWidth * (Math.random() % 1)),
        }
	}
	
	addItems(elements: HTMLElement[]) {
		for (let element of elements) {
			this.addItem(element);
        }
        
        return this.items;
	}
	
	addItem(element: HTMLElement) {
		let item = new PackageItem(element);
        
        let tryCounter = 0;
		do {
            tryCounter++

            let position = this._getPosition(this.container.clientHeight, this.container.clientWidth);
            item.top = position.top > item.height ? position.top - item.height : position.top;
            item.left = position.left > item.width ? position.left - item.width : position.left;
            
            let maxTries = this.options.maxTriesPerItem as number;
            if (tryCounter >= maxTries) {
                throw new Error('Tried repositioning more than allowed! Change options.maxTriesPerItem to exceed better Results');
            }

		} while(item.collides(this.items))
        
        this._lastAddedItem = item;
        this.items.push(item);

        return item;
	}
    
    reset() {
        
    }
    
	layout() {
		for (let item of this.items) {
			if (!item.shouldRearrange || !item.originElement) {
					continue;
			}
			
			item.originElement.style.top = item.top +'px';
			item.originElement.style.left = item.left +'px';
		}
	}
}