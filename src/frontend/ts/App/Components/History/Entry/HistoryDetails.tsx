import * as React from 'react';

import CmsRoutingComponent, { CmsRoutingState } from "../../../../Core/Router/AbstractRoutingComponent";
import { CmsState, CmsProps } from "../../../../Core/CmsControlledComponent";
import { NavigationLink } from "../../../../Core/Router/Navigation";

export default class HistoryDetails extends CmsRoutingComponent<CmsProps<any>, CmsRoutingState> {

    ref: HTMLElement | null;

    link() : NavigationLink {
        return {
            url: '',
            title: '',
            text: '',
        }
    }
    navigationId(): string | false {
        throw new Error("Method not implemented.");
    }

    constructor(props: CmsProps<any>) {
        super(props);
        this.ref = null;
    }

    render() {
        return (
            <div ref={(ref) => this.ref = ref}>
                
            </div>
        )
    }

    enter(): void {
        throw new Error("Method not implemented.");
    }
    leave(): void {
        throw new Error("Method not implemented.");
    }
} 