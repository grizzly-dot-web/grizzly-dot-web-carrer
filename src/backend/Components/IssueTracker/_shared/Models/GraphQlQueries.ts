import config from 'config-yml';

const infoGraphQL =  `
    query {
        repository(owner: "${config.github.owner}", name: "${config.github.repo}") {
            issues(last: 20, states: OPEN) {
                edges {
                    node {
                        reactions(last: 10) {
                        edges {
                            node {
                                id
                                content
                            }
                        }
                    }
                    id
                    url
                    title
                }
            }
        }
        milestones(last: 20) {
            edges {
                node {
                    id
                    title
                }
            }
        }
        labels(first: 20) {
            totalCount
                edges {
                    node {
                        id
                        name
                        description
                    }
                }
            }
        }
    }
`;

export default infoGraphQL