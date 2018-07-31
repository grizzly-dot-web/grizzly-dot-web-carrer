import React from "react";

export interface LevelProps {
    className : string
    name : string
    id : string
    onClick : (id : string) => void
    isActive? : boolean
    description? : string
}

export class Level extends React.Component<LevelProps> {
    render() {

        if (!this.props.description) {
            return (
                <button title={this.props.name} className={`experience-level-toggle ${this.props.className} ${this.props.isActive ? 'active' : ''}`} onClick={(e) => this.props.onClick(this.props.id)} >
                    <span className={`experience-level experience-level_short ${this.props.className}`}>
                        {this.props.name[0]}
                    </span>
                </button>
            );
        }

        return (
            <button className={`experience-level-toggle ${this.props.className} ${this.props.isActive ? 'active' : ''}`} onClick={(e) => this.props.onClick(this.props.id)} >
                <span className={`experience-level ${this.props.className}`}>
                    {this.props.name}
                </span>
                {this.props.description}
            </button>
        );
    }
}
