import * as React from 'react';
import { ExperienceTag } from './_index';
import { Level } from './Level';


export interface FilterEntries {
    tags: string[],
    level: number
}

export interface FilterProps {
    availableTags : { [level:string]: ExperienceTag } 
    availableLevels : { [level:string]: ExperienceTag } 
    filter : FilterEntries
    onChange: (filter : FilterEntries) => void
}

export class Filter extends React.Component<FilterProps, FilterEntries> {

    ref: HTMLElement | null;
    legendIsStateChanging : boolean;

    constructor(props : FilterProps, context : any) {
        super(props, context);

        this.state = {
            tags: this.props.filter ? this.props.filter.tags : [],
            level: this.props.filter ? this.props.filter.level : 200,
        }

        this.ref = null;
        this.legendIsStateChanging = false;
        this.handleTagChange = this.handleTagChange.bind(this);
        this.handleLegendClick = this.handleLegendClick.bind(this);
    }

    render() {
        let legendItems = Object.keys(this.props.availableLevels).sort((a,b) => a < b ? 1 : -1).map(id => {
            let level = this.props.availableLevels[id];
            
            let activeClass = '';
            if (this.props.filter && parseInt(id) >= this.props.filter.level) {
                activeClass = 'is-active';
            }

            return (
                <Level key={id} {...level} className={`${level.className} ${activeClass}`} onClick={this.handleLegendClick} />
            );
        });

        let tags = Object.keys(this.props.availableTags).map((id) => {
            let tag = this.props.availableTags[id];
            let activeClass = '';
            if (this.props.filter && this.props.filter.tags.indexOf(id) !== -1) {
                activeClass = 'is-active';
            }

            return <Level key={id} {...tag} className={`${tag.className} ${activeClass}`} onClick={this.handleTagChange} />;
        });

        return (
            <div className="experience-overview-filter">
                <div className="experience-tags">
                    <h4 className="experience-filter-header">
                        <span className="h3">Tag</span> <span className="h4">filter</span>
                    </h4>
                    {tags}
                </div>
                <h4 className="experience-filter-header">
                    <span className="h3">Skill level</span> <span className="h4">filter</span>
                </h4>
                <hr className="experience-filter-seperator" />
                <div className="experience-level-legend">
                    <div className="legend-frame">{legendItems}</div>
                </div>
            </div>
        );
    }

    handleTagChange(LevelId : string) {
        let tags = this.state.tags;
        if (tags.indexOf(LevelId) === -1) {
            tags.push(LevelId);
        } else {
            tags.splice(tags.indexOf(LevelId));
        }

        let newState =  {
            ...this.state,
            tags: tags
        };
        
        this.setState(newState, () => this.props.onChange(newState));
    }

    handleLegendClick(LevelId : string) { 
        let newState = {
            ...this.state,
            level: parseInt(LevelId)
        };

        this.setState(newState, () => this.props.onChange(newState));
    }
}
