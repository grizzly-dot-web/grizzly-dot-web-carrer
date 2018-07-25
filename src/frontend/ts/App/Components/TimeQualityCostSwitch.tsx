import * as React from 'react';

export default class TimeQualityCostSwitch extends React.Component {

    ref: HTMLElement|null = null

	render() {
		return (
            <div ref={(ref) => this.ref = ref} className="time-quality-cost-switch">
                <button data-type="time">Fast</button>
                <button data-type="quality" className="importent is-active">Good</button>
                <button data-type="cost">Cheap</button>
            </div>
        );
    }
    
    componentDidMount() {
        if (!this.ref) {
    	    return;
        }

        var buttons = this.ref.querySelectorAll('button');
        var lastChosenType = 'quality';
        var qualitiyCheck = (current : HTMLElement) => {
            var disabled : string[] = [];
            switch (current.getAttribute('data-type')) {
                case 'time':
                disabled = ['quality', 'cost'];
                break;
                case 'quality':
                disabled = ['time', 'cost'];
                break;
                case 'cost':
                disabled = ['quality', 'cost'];
                break;
            }
            
            
            for (var button of buttons) {
                if (disabled.indexOf(button.getAttribute('data-type') as string) === -1) {
                    button.classList.remove('is-active')
                }
            }  
        
            current.classList.add('is-active')
        };

        for (let b of buttons) {
            qualitiyCheck(b);
            b.addEventListener('click', () => qualitiyCheck(b));
        }
    }
	
}
