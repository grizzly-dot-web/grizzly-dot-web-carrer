export class Blocker {

    container : HTMLElement

    originElement : HTMLElement
    
    constructor(element : HTMLElement, container : HTMLElement) {
        this.originElement = element;
        this.container = container; 
    }

    get left() {
        return this._getGlobalOffset(this.originElement, this.container).left
    }

    get top() {
        return this._getGlobalOffset(this.originElement, this.container).top
    }

    get right() {
        return this.left + this.width      
    }

    get bottom() {
        return this.top + this.height
    }

    get width() {
        return this.originElement.clientWidth
    }

    get height() {
        return this.originElement.clientHeight
    }

    public collidateWith(coordinate : { x: number, y:number }) {
        return (
            (
                coordinate.y > this.top && 
                coordinate.y < this.bottom
            ) && (
                coordinate.x > this.left && 
                coordinate.y < this.right
            )
        );
    }

    private _getGlobalOffset(element : HTMLElement, container : HTMLElement) : { left : number, top: number} {
        var left = 0, top = 0
        let el = element;
        
        while (el && el !== container) {
            left += el.offsetLeft
            top += el.offsetTop
            el = el.offsetParent as HTMLElement
        }

        return { left: left, top: top }
    }

}

export default class PositioningHelper {

    blockingOffsets : Blocker[];

    container : HTMLElement;

    static GridItemWidth = 40; 

    constructor(container : HTMLElement, blockingElements : HTMLElement[]|null = null) {
        this.container = container;

        this.blockingOffsets = [];
        if (blockingElements != null) {
            for (let element of blockingElements) {
                this.blockingOffsets.push(new Blocker(element, this.container));
            }
        }
    }

    positionElement(element : HTMLElement) {
        let position = this._getUniqueAssignedPostion(element);

        console.log('before: ', element.offsetTop);

        element.style.top = position.top +'px';
        element.style.left = position.left +'px';

        console.log('after: ', element.offsetTop);

        this.blockingOffsets.push(new Blocker(element, this.container));
        
        return position;
    }

    private _getUniqueAssignedPostion(element : HTMLElement) {
        const min_x = 0;
        const min_y = 0;

        const max_x = this.container.clientWidth - element.clientWidth;
        const max_y = this.container.clientHeight - element.clientWidth;
        
        let upperLeftCornerCoordinate : { x: number, y:number };
        let lowerRightCornerCoordinate : { x: number, y:number };

        let shouldReturnHighValue = false;
        let collision = true;
        
        do {
            upperLeftCornerCoordinate = {
                x: Math.round(min_x + ((max_x - min_x) * (Math.random() % 1))),
                y: Math.round(min_y + ((max_y - min_y) * (Math.random() % 1)))
            }

            lowerRightCornerCoordinate = {
                x: upperLeftCornerCoordinate.x + element.clientWidth,
                y: upperLeftCornerCoordinate.y + element.clientHeight,
            }

            console.log('COLLISION DEBUGGING ________________')
            console.log('ELEMENT: left', upperLeftCornerCoordinate.x, 'right', lowerRightCornerCoordinate.x, 'top', upperLeftCornerCoordinate.x, 'bottom', lowerRightCornerCoordinate.y)

            for (let blocker of this.blockingOffsets) {
                if (blocker.collidateWith(upperLeftCornerCoordinate) || blocker.collidateWith(lowerRightCornerCoordinate)) {
                    console.log('BLOCKER: left', blocker.left, 'right', blocker.left + blocker.width, 'top', blocker.top, 'bottom', blocker.top + blocker.height);
                    collision = true;
                } else {
                    collision = false;
                }
            }
        } while(collision)

        return {
            top: upperLeftCornerCoordinate.y,
            left:  upperLeftCornerCoordinate.x,
        }
    }

    getRandomGridPosition(maxValue: number, shouldReturnHighValue : boolean): number {
        let columnWidth = maxValue / PositioningHelper.GridItemWidth;
        
        let column = Math.floor(Math.random() * columnWidth); 
        if (shouldReturnHighValue) {
            column = Math.floor(Math.random() * columnWidth - columnWidth / 2 + 1) + columnWidth / 2; 
        }

        return Math.round(column * PositioningHelper.GridItemWidth);
    }

    debug() {
        for (let blocker of this.blockingOffsets) {
            let foo = document.createElement('div');
            foo.style.setProperty('top', `${blocker.top}px`);
            foo.style.setProperty('left', `${blocker.left}px`);
            foo.style.setProperty('height', `${blocker.height}px`);
            foo.style.setProperty('width', `${blocker.width}px`);
            foo.style.setProperty('opacity', `0.5`);
            foo.style.setProperty('position', `absolute`);
            foo.style.setProperty('background-color', `rgba(255, 0, 0, 0.5)`);

            this.container.appendChild(foo);
        }
    }

}