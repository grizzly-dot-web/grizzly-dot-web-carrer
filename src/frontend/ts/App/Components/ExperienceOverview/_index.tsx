import * as React from 'react';
import { Filter, FilterEntries } from './Filter';
import { Level } from './Level';

export interface ExperiencesProps {
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
            filter: {
                tags: ['interested'],
                level: 200
            }
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
                    <h2 className="experience-overview--title">Skills</h2>
                    <Filter availableLevels={this.experienceLevels} availableTags={this.experienceTags} filter={this.state.filter} onChange={this.handleFilterChange} />
                    <section className="experience-item-wrapper">
                        {this._renderTypeRows(otherExperiences)}
                    </section>
                </section>
                <section className={`references`}>
                    <h2 className="experience-overview--title">Referenzen</h2>
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

    _renderExperiences(experiences : Experience[]) {
        let counter = 0;
        let rendered = [];
        for (let exp of experiences) {
            counter++;

            if (
                (!exp.level || this.state.filter.level > parseInt(exp.level)) &&
                (!exp.tags || exp.tags.filter((tag) => this.state.filter.tags.indexOf(tag) !== -1).length <= 0)
            ) {
                continue;
            }

            rendered.push(this._renderSingleExp(exp, counter.toString()));
        }

        return rendered;
    }

    _renderSingleExp(experience : Experience, key : string) {
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
            description: "Entweder ist dieser Skill nicht mehr Zeitgemäß oder ich habe entschieden ihn zu verwerfen."
        },
        200:  { 
            className : "tag_untrained", 
            id: '200',
            name: "untrained", 
            description: "Hiermit habe ich mich länger nicht beschäftigt, bzw. bin ich in meiner Karriere nicht oft dazu gekommen."
        },
        400:  { 
            className : "tag_assess", 
            id: '400',
            name: "assess", 
            description: "Ich habe bereits einige Erfahrung mit diesem Skill, bin allerdings nicht sicher ob ich ihn in meinen Alltag aufnehme."
        },
        500:  { 
            className : "tag_mastered", 
            id: '500',
            name: "mastered", 
            description: "Dieser Skill ist teil meines Alltags, ich kenne mich hiermit sehr gut aus."
        },
    }

    experienceTags :  { [level:string]: ExperienceTag } = {
        'interested': { 
            className : "tag_interested", 
            id: "interested",
            name: "interested", 
            description: "Ich bin an diesem Skill interessiert, habe allerdings noch keine bis wenig Übung darin."
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

export interface Experience {
	url: string,
	title: string,
	level?: string
	tags?: string[]
	category: string,
	type: string,
}

export interface HistoryEntry {
	url: string,
	title: string
	begin_date? : string
	end_date? : string
	institutions: Institution[],
	experiences: Experience[]
}

export interface ExperienceTag {
    name : string
    id : string
    className : string 
    description: string
}