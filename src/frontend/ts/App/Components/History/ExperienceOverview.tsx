import * as React from 'react';
import AbstractRoutingComponent from "../../../AbstractRoutingComponent";

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
            description: "Hiermit habe ich mich länger nicht beschäftigt, bzw. bin ich in meiner Karriere nicht oft dazu gekommen"
        },
        300:  { 
            className : "level_interested", 
            name: "interested", 
            description: "Ich bin an diesem Skill interessiert, habe allerdings noch keine Übung darin"
        },
        400:  { 
            className : "level_assess", 
            name: "assess", 
            description: "Ich habe bereits einige Erfahrung mit diesem Skill, bin allerdings nicht sicher ob ich ihn in meinen Alltag aufnehme"
        },
        500:  { 
            className : "level_mastered", 
            name: "mastered", 
            description: "Dieser Skill ist teil meines Alltags, ich kenne mich hiermit sehr gut aus."
        }
    }

    _reorderExperienceData() : { [type : string] : any[] } {
        let experiences : any = {};
        for (let entry of this.props.data) {
            for (let exp of entry.experiences) {
                if (!experiences.hasOwnProperty(exp.type)) {
                    experiences[exp.type] = [];
                }

                if (experiences[exp.type].find( (e:any) => e.title == exp.title)) {
                    continue;
                }

                if (!exp.url) {
                    exp.url = `/carrer/${entry.url}#${exp.title}`
                }
                experiences[exp.type].push(exp);
            }
        }

        return experiences;
    }

    render() {
        let referenceExperiences = this._reorderExperienceData()['reference'];

        let otherExperiences = this._reorderExperienceData();
        delete otherExperiences.reference;
        
        return (
            <section ref={ref => this.ref = ref} className={`experience-overview`}>
                <div className="experience-item-wrapper">
                    {this._renderTypeRows(otherExperiences)}
                    {this._renderLegend()}
                </div>
               <div className={`experience-type reference`}>
                    <h3>Referenzen</h3>
                    <div className="experience-item-wrapper">
                        { this._renderExperiences(referenceExperiences)}
                    </div>
                </div>
            </section>
        );
    }
    
    _renderTypeRows(experiences : {[type : string] : any[]}) {
        let types = [];
        let counter = 0;
        for (let type in experiences) {
            counter++;
            let renderedExperiences = this._renderCategories(type, experiences[type]);

            types.push(
                <div key={counter} className={`experience-type ${type}`}>
                     <h3>{type}</h3>
                     <div className="experience-item-wrapper">
                         {renderedExperiences}
                     </div>
                 </div>
            );
        }

        return types;
    }

    _renderCategories(type : string, experiences : any[]): any {
        let categorizedExp : any[] = [];
        let categoryIndex : {[cat:string] : number} = {};
        for (let exp of experiences) {
            if (!categoryIndex.hasOwnProperty(exp.category)) {
                categoryIndex[exp.category] = categorizedExp.length;
                categorizedExp[categoryIndex[exp.category]] = [];
            }

            categorizedExp[categoryIndex[exp.category]].push(exp);
        }

        let counter = 0;
        let rendered = [];
        for (let experiences of categorizedExp.sort( (a, b) => a.length < b.length ? 1 : -1 )) {
            counter++;

            let renderedExperiences = this._renderExperiences(experiences);

            if (renderedExperiences.length <= 0) {
                continue;
            }

            rendered.push(
                <div key={counter} className="experience-category">
                    <h4>{experiences[0].category}</h4>
                    <div className="experience-item-wrapper">
                        {renderedExperiences}
                    </div>
                </div>
            );
            
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
            <a href={url} target={target} key={key} className="experience-item">
                {inner}
                {renderedLevel}
            </a>
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

        return <nav className="experience-level-legend">{legendItems}</nav>;
    }

    _mapExperienceLevel(level : string) {
        if (!ExperienceOverview.Tags.hasOwnProperty(level)) {
            throw new Error(`Experience Level not valid: ${level}`);
        }

        return ExperienceOverview.Tags[level];
    }

    componentDidUpdate() {
        this.assignActiveLegendLevels();
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
        let ref = this.ref as HTMLElement;
        
        this.assignActiveLegendLevels();
        this.appElement.classList.add(`${this.appClassSlug}__active`);
        this.appElement.classList.add(`${this.appClassSlug}__entered`);
    }
    
    leave(): void {
        this.appElement.classList.remove(`${this.appClassSlug}__active`);
        this.appElement.classList.remove(`${this.appClassSlug}__entered`);
    }
    
    acitveStateCondition(): boolean {
        let active = this.appElement.classList.contains(`${this.appClassSlug}__entered`);
        this.appElement.classList.remove(`${this.appClassSlug}__entered`);

        return active;
    }
} 