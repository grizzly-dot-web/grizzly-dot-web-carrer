import * as React from 'react';
import AbstractRoutingComponent from '../Core/Router/AbstractRoutingComponent';

export interface ExperienceLevel {
    name : string
    className : string 
    description: string
}

export interface ExperienceOverviewProps {
	data : any
}
export interface ExperienceOverviewState {
	visibleExperienceLevel : number
}

export default class ExperienceOverview extends AbstractRoutingComponent<ExperienceOverviewProps, ExperienceOverviewState> {

    ref: HTMLElement | null;
    url = '/carrer/experiences';

    appClassSlug = 'experience-overview';
    legendIsStateChanging : boolean;

    constructor(props: ExperienceOverviewProps, context?: any) {
        super(props, context);

        this.ref = null;
        this.legendIsStateChanging = false;
        
        this.state = {
            visibleExperienceLevel: parseInt(Object.keys(ExperienceOverview.Tags)[1])
        };

        this.handleLegendClick = this.handleLegendClick.bind(this)
    }

    static Tags : { [level:string]: ExperienceLevel } = {
        100:  { 
            className : "level_discarded", 
            name: "discarded",
            description: "Entweder ist dieser Skill nicht mehr Zeitgemäß oder ich habe entschieden ihn zu verwerfen."
        },
        200:  { 
            className : "level_untrained", 
            name: "untrained", 
            description: "Hiermit habe ich mich länger nicht beschäftigt, bzw. bin ich in meiner Karriere nicht oft dazu gekommen."
        },
        300:  { 
            className : "level_interested", 
            name: "interested", 
            description: "Ich bin an diesem Skill interessiert, habe allerdings noch keine bis wenig Übung darin."
        },
        400:  { 
            className : "level_assess", 
            name: "assess", 
            description: "Ich habe bereits einige Erfahrung mit diesem Skill, bin allerdings nicht sicher ob ich ihn in meinen Alltag aufnehme."
        },
        500:  { 
            className : "level_mastered", 
            name: "mastered", 
            description: "Dieser Skill ist teil meines Alltags, ich kenne mich hiermit sehr gut aus."
        }
    }

    _groupExperienceDataByProperty(data : any[], property : string) {
        let experiences : { [type : string] : any[] } = {};

        for (let exp of data) {
            if (!experiences.hasOwnProperty(exp[property])) {
                experiences[exp[property]] = [];
            }

            if (experiences[exp[property]].find( (e:any) => e.title == exp.title)) {
                continue;
            }

            experiences[exp[property]].push(exp);
        }

        return experiences;
    }

    render() {
        let experiences : any[] = [];
        for (let historyEntry of this.props.data) {
            experiences = experiences.concat(historyEntry.experiences);
        }

        let orderedExp = this._groupExperienceDataByProperty(experiences, 'type');

        let referenceExperiences = orderedExp['reference'];
        let otherExperiences = orderedExp;
        delete otherExperiences.reference;
        
        return (
            <div ref={ref => this.ref = ref} className={`experience-overview`}>
                <div className="inner">
                    <section className={`skills`}>
                    <h3 className="experience-overview--title">Skills</h3>
                        {this._renderLegend()}
                        <section className="experience-item-wrapper">
                            {this._renderTypeRows(otherExperiences)}
                        </section>
                    </section>
                    <section className={`references`}>
                        <h3 className="experience-overview--title">Referenzen</h3>
                        <div className="experience-item-wrapper">
                           { this._renderExperiences(referenceExperiences)}
                        </div>
                    </section>
                </div>
            </div>
        );
    }
    
    _renderTypeRows(experiences : {[type : string] : any[]}) {
        let types = [];
        let counter = 0;
        for (let type in experiences) {
            counter++;
            let renderedExperiences = this._renderCategories(type, experiences[type]);

            if (renderedExperiences.length <= 0) {
                continue;
            }

            types.push(
                <div key={counter} className={`experience-type ${type}`}>
                     <h4 className="experience-overview--type-title">{type}</h4>
                     <div className="experience-item-wrapper">
                         {renderedExperiences}
                     </div>
                 </div>
            );
        }

        return types;
    }

    _renderCategories(type : string, experiences : any[]): any {
        let counter = 0;
        let rendered = [];
        let renderedExperiences = [];
        let groupedExperiences = this._groupExperienceDataByProperty(experiences, 'category');

        for (let category in groupedExperiences) {
            let renderedExperiences = this._renderExperiences(groupedExperiences[category]);

            if (renderedExperiences.length <= 0) {
                continue;
            }

            rendered.push(<div className="category-wrap" key={category}>
                <h5 key={`headline-${counter}`} className={`category-headline`}>{category}</h5>
                {renderedExperiences}
            </div>);

        }

        return rendered;
    }

    _renderExperiences(experiences : any[]) {
        let counter = 0;
        let rendered = [];
        for (let exp of experiences) {
            counter++;

            if (this.state.visibleExperienceLevel > exp.level) {
                continue;
            }

            rendered.push(this._renderSingleExp(exp, counter.toString()));
        }

        return rendered;
    }

    _renderSingleExp(experience : any, key : string) {
        let inner = experience.title;
        if (experience.icon) {
            inner = <img src={experience.icon} />;
        }

        let url = experience.url;
        let target = undefined;
        if (experience.url != null && experience.url != '') {
            target = "_blank"
            url = experience.url;
        }

        let renderedLevel = null;
        if (experience.level) {
            let expLevel = this._mapExperienceLevel(experience.level);
            renderedLevel = <span className={`experience-level ${expLevel.className}`} title={expLevel.name}>{expLevel.name.charAt(0)}</span>   
        }

        return (
            <div key={key} className="experience-item">
                <a href={url} target={target}>
                    {inner}
                    {renderedLevel}
                </a>
            </div>
        );
    }

    _renderLegend() {
        let legendItems = [];
        for (let levelCode in ExperienceOverview.Tags) {
            let currentLevel = ExperienceOverview.Tags[levelCode];
            legendItems.push(
                <button key={levelCode} className={`experience-level-toggle ${currentLevel.className}`} data-level-code={levelCode} onClick={(e) => this.handleLegendClick(e, parseInt(levelCode), currentLevel)} >
                    <span className={`experience-level ${currentLevel.className}`}>
                        {currentLevel.name}
                    </span>
                    {currentLevel.description}
                </button>
            );
        }

        return <nav className="experience-level-legend"><div className="legend-frame">{legendItems}</div></nav>;
    }

    _mapExperienceLevel(level : string) {
        if (!ExperienceOverview.Tags.hasOwnProperty(level)) {
            throw new Error(`Experience Level not valid: ${level}`);
        }

        return ExperienceOverview.Tags[level];
    }

    assignActiveLegendLevels(currentLevelCode : number|null = null) {
        let ref = this.ref as HTMLElement;
        if (this.legendIsStateChanging) {
            return;
        }
        
        let toggleActiveClasses = (elements : HTMLElement[], delay: number, className : string, condition : Function) => {
            return new Promise((resolve) => {
                let counter = 0;
                this.legendIsStateChanging = true;

                if (elements.length <= 0) {
                    return resolve();
                }

                elements.forEach((element) => {
                    setTimeout(() => {
                        let levelCode = element.getAttribute('data-level-code') as string;

                        if (condition(levelCode)) {
                            element.classList.add('active');
                        } else {
                            element.classList.remove('active');  
                        }
    
                        if (element == elements[elements.length - 1]) {
                            return resolve();
                        }
                    }, delay * counter);

                    counter++;
                });
            });
        }

        let buttons : HTMLElement[] = [].slice.call(ref.querySelectorAll('.experience-level-toggle'), 0);
        toggleActiveClasses(buttons.filter( e => currentLevelCode && parseInt(e.getAttribute('data-level-code') as string) < currentLevelCode), 100, 'active', (levelCode : string) => false).then(() => {
            toggleActiveClasses(buttons.reverse(), 100, 'active', (levelCode : string) => {
                return parseInt(levelCode) >= this.state.visibleExperienceLevel
            }).then(() => {
                this.legendIsStateChanging = false;
            });
        });
    }

    handleLegendClick(e : React.MouseEvent<HTMLElement>, levelCode: number, level: ExperienceLevel) {
        this.setState(Object.assign(this.state, {
            visibleExperienceLevel: levelCode
        }));

        this.assignActiveLegendLevels(levelCode);
    }

    enter(): void {       
        this._router.disableActiveDetection = true;

        this.assignActiveLegendLevels();
        this.appElement.classList.add(`${this.appClassSlug}__active`);
        this.appElement.classList.add(`${this.appClassSlug}__entered`);
    }
    
    leave(): void {
        this._router.disableActiveDetection = false;

        this.appElement.classList.remove(`${this.appClassSlug}__active`);
        this.appElement.classList.remove(`${this.appClassSlug}__entered`);
    }
    
    acitveStateCondition(): boolean {
        let active = this.appElement.classList.contains(`${this.appClassSlug}__entered`);
        this.appElement.classList.remove(`${this.appClassSlug}__entered`);

        return active;
    }
} 