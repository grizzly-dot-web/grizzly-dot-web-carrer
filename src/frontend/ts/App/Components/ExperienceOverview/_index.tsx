import * as React from 'react';
import { Filter, FilterEntries } from './Filter';
import { Level } from './Level';

export interface ExperiencesProps {
    filter : FilterEntries
	data : HistoryEntry[]
}

export interface ExperiencesState {
    filter : FilterEntries
}

export default class ExperienceOverview extends React.Component<ExperiencesProps, ExperiencesState> {

    ref: HTMLElement | null;

    appClassSlug = 'experience-overview';

    constructor(props: ExperiencesProps, context?: any) {
        super(props, context);

            
        this.state = { 
            filter: this.props.filter
        };

        this.ref = null;
        this.handleFilterChange = this.handleFilterChange.bind(this)
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

    componentWillReceiveProps(nextProps : ExperiencesProps) {
          this.setState(Object.assign(this.state, { 
              filter: nextProps.filter 
        }));
    }

    render() {
        let experiences : any[] = [];
       
        if (this.props.data.length <= 0) {
            return null;
        }

        for (let historyEntry of this.props.data) {
            experiences = experiences.concat(historyEntry.experiences);
        }

        let orderedExp = this._groupExperienceDataByProperty(experiences, 'type');

        let referenceExperiences = orderedExp['reference'];
        let otherExperiences = orderedExp;
        delete otherExperiences.reference;
        
        return (
            <div ref={ref => this.ref = ref} className={`experience-overview`}>
                <section className={`skills`}>
                    <h3 className="h2">Skills</h3>
                    <Filter availableLevels={this.experienceLevels} availableTags={this.experienceTags} filter={this.state.filter} onChange={this.handleFilterChange} />
                    <section className="experience-item-wrapper">
                        {this._renderTypeRows(otherExperiences)}
                    </section>
                </section>
                <section className={`references`}>
                    <h3 className="h2">Referenzen</h3>
                    <div className="experience-item-wrapper">
                        { this._renderExperiences(referenceExperiences)}
                    </div>
                </section>
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

    _renderExperiences(experiences : Skill[]) {
        let counter = 0;
        let rendered = [];
        for (let exp of experiences) {
            counter++;

            let reference = exp as Reference;
            if (reference.type === 'reference') {
                rendered.push(this._renderSingleReference(reference, counter.toString()));
                continue;
            }

            if (
                (!exp.level || this.state.filter.level > parseInt(exp.level)) &&
                (!exp.tags || exp.tags.filter((tag) => this.state.filter.tags.indexOf(tag) !== -1).length <= 0)
            ) {
                continue;
            }

            rendered.push(this._renderSingleSkill(exp, counter.toString()));
        }

        return rendered;
    }

    _renderSingleSkill(experience : Skill, key : string) {
        let expLevel = null;
        
        let handleLevelClick = (id : string, filterKey : string, isMulti : boolean) => {
            let filter = this.state.filter as any;

            if (isMulti) {
                filter[filterKey].push(id);
            } else {
                filter[filterKey] = id;
            }

            this.setState(Object.assign(
                this.state,
                {
                    ...this.state.filter,
                    filter: filter[filterKey]
                }
            ));
        }

        if (experience.level) {
            let level = { ...this._mapExperienceTag(experience.level, this.experienceLevels)};
            delete level.description;
            expLevel = <Level key={level.id} {...level} onClick={(id) => handleLevelClick(id, 'level', false)} />;
        }

        let expTags = null;
        if (experience.tags) {
            expTags = experience.tags.map((tag) => {
                let expTag = { ...this._mapExperienceTag(tag, this.experienceTags)};
                delete expTag.description;
                return <Level key={expTag.id} {...expTag} onClick={(id) => handleLevelClick(id, 'tags', true)} />
            });
        }

        return (
            <div key={key} className="experience-item">
                <a href={experience.url} target={'_blank'}>
                    {experience.title}
                </a>
                {expLevel}
                {expTags}
            </div>
        );
    }
    
    _renderSingleReference(experience : Reference, key : string) {
        let inner : any = experience.title;
        if (experience.icon) {
            inner = <img src={experience.icon} />;
        }

        return (
            <div key={key} className="experience-item">
                <a href={experience.url} target={'_blank'}>
                    {inner}
                </a>
            </div>
        );
    }

    handleFilterChange(filter : FilterEntries) {
        this.setState(Object.assign(this.state, {
            filter: filter
        }));
    }

    _mapExperienceTag(id : string, tags : { [level:string]: ExperienceTag }) {
        if (!tags.hasOwnProperty(id)) {
            throw new Error(`Experience Level not valid: ${id}`);
        }

        return tags[id];
    }

    experienceLevels :  { [level:string]: ExperienceTag } = {
        100:  { 
            className : "tag_discarded", 
            id: '100',
            name: "discarded",
            description: "this skill has been discarded because it had been deprecated or I had decided to discard it."
        },
        200:  { 
            className : "tag_untrained", 
            id: '200',
            name: "untrained", 
            description: "It's been quite a while I had worked with it or I had not been much contact with it in my career."
        },
        300:  { 
            className : "tag_assess", 
            id: '300',
            name: "assess", 
            description: "I already have quite well Experience with this skill, but i'm not shure to work with it in daily basis."
        },
        400:  { 
            className : "tag_learned", 
            id: '400',
            name: "learned", 
            description: "I have learned this skill, but it is not part of my daily basis."
        },
        500:  { 
            className : "tag_mastered", 
            id: '500',
            name: "mastered", 
            description: "This skill is part of my daily routine and I am quite good at it."
        },
    }

    experienceTags :  { [level:string]: ExperienceTag } = {
        'interested': { 
            className : "tag_interested", 
            id: "interested",
            name: "interested", 
            description: "I am very interested in this Skill"
        }
    }
} 

export interface Institution {
	begin_date: string,
	end_date?: string,
	type: string
	title: string,
	url: string,
	job_title: string,
	industry: string,
	company_size: string,
}

export interface BaseExperience {
	url: string,
	title: string,
	category: string,
	type: 'reference'|'skill',
}
export interface Skill extends BaseExperience {
	level?: string
	tags?: string[]
	type: 'skill',
}
export interface Reference extends BaseExperience {
	icon?: string
}

export interface HistoryEntry {
	url: string,
	title: string
	begin_date? : string
	end_date? : string
	institutions: Institution[],
	experiences: BaseExperience[]
}

export interface ExperienceTag {
    name : string
    id : string
    className : string 
    description: string
}