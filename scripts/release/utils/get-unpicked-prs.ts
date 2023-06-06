import { graphql, GraphQlQueryResponseData } from '@octokit/graphql';

const graphqlWithAuth = graphql.defaults({
  headers: { authorization: `token ${process.env.GH_TOKEN}` },
});

export interface PR {
  number: number;
  id: string;
  branch: string;
  title: string;
  mergeCommit: string;
}

export async function getUnpickedPRs(sourceBranch: string): Promise<Array<PR>> {
  const result = await graphqlWithAuth<GraphQlQueryResponseData>(
    `
      query ($owner: String!, $repo: String!, $state: PullRequestState!, $order: IssueOrder!) {
        repository(owner: $owner, name: $repo) {
          pullRequests(states: [$state], labels: ["patch"], orderBy: $order, first: 50) {
            nodes {
              id
              number
              title
              baseRefName
              mergeCommit { 
                abbreviatedOid
              }
              labels(first: 20) {
                nodes {
                  name
                }
              }
            }
          }
        }
      }
    `,
    {
      owner: 'storybookjs',
      repo: 'monorepo-release-tooling-prototype',
      order: {
        field: 'UPDATED_AT',
        direction: 'ASC',
      },
      state: 'MERGED',
    }
  );

  const {
    pullRequests: { nodes },
  } = result.repository;

  const prs = nodes.map((node: any) => ({
    number: node.number,
    id: node.id,
    branch: node.baseRefName,
    title: node.title,
    mergeCommit: node.mergeCommit.abbreviatedOid,
    labels: node.labels.nodes.map((l: any) => l.name),
  }));

  const unpickedPRs = prs.filter((pr: any) => !pr.labels.includes('picked'));
  return unpickedPRs.filter((pr: any) => pr.branch === sourceBranch);
}
