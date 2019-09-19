import React, { Component } from 'react';
import { queryItemsLatestVersionByType } from "../graphql/queries";
import { graphql, compose, withApollo } from "react-apollo";
import gql from "graphql-tag";
import moment from "moment";

export class ProjectUtilization extends Component {
    showWeeklyUtilization(project, weeklySumArr, indexOfResourcesArr) {
        if (indexOfResourcesArr === 0) {
            return weeklySumArr.map((sum, i) => (
                <td key={i} rowSpan={project["resources"].length} scope="rowgroup">
                    {parseFloat(100 * sum / (40 * project["resources"].length)).toFixed(2)}
                </td>
            ));
        }
        else {
            return null;
        }
    }


    // Take a date input and return the date for upcoming friday for the week
    getFriday(date) {
        if (moment(date).format('dddd') === "Friday") { return date; }
        else {
            let friday = moment(date);
            while (friday.format('dddd') !== "Friday") {
                friday = friday.add(1, "days");
            }
            return moment(friday).format("YYYY-MM-DD");
        }
    }


    render() {

        let { resources, timesheet_entries, proj_res_links, projects } = this.props;

        let firstFriday = ""; // The first Friday for the timesheet entries
        let lastFriday = ""; // The last Friday for the timesheet entries
        let allFridays = [];
        let timesheetsPerProjectPerResourcePerWeek = [];

        if (timesheet_entries && timesheet_entries.length > 0) {
            timesheet_entries = timesheet_entries.sort((a, b) => {
                const date1 = moment(a.date, "YYYY-MM-DD");
                const date2 = moment(b.date, "YYYY-MM-DD");
                if (date1.isAfter(date2)) {
                    return 1;
                } else if (date2.isAfter(date1)) {
                    return -1;
                } else {
                    return 0;
                }
            });

            firstFriday = this.getFriday(timesheet_entries[0].date);
            lastFriday = this.getFriday(timesheet_entries[timesheet_entries.length - 1].date);

            allFridays[0] = firstFriday;
            while (allFridays[allFridays.length - 1] !== lastFriday) {
                allFridays.push(moment(allFridays[allFridays.length - 1]).add(7, "days").format("YYYY-MM-DD"));
            }

        }


        if (resources && resources.length > 0 && timesheet_entries && timesheet_entries.length > 0
            && projects && projects.length > 0 && proj_res_links && proj_res_links.length > 0
        ) {

            projects = projects.sort((a, b) => a.name.localeCompare(b.name));

            projects.forEach((p, indexofProjectArr) => {

                timesheetsPerProjectPerResourcePerWeek[indexofProjectArr] = Object.assign({}, p);
                timesheetsPerProjectPerResourcePerWeek[indexofProjectArr]["resources"] = [];

                let resourcesForProject = [];

                let resourceLinksForProject = proj_res_links.filter(prl => prl.project_id === p.type_id);

                resourceLinksForProject.forEach(prl => {
                    let resource = resources.find(r => r.type_id === prl.resource_id);
                    if (!!resource) {
                        resourcesForProject.push(resource);
                    }
                });

                resourcesForProject.forEach((r, n) => {

                    timesheetsPerProjectPerResourcePerWeek[indexofProjectArr]["resources"][n] = Object.assign({}, r);

                    let weeklyTimesheetForResource = [];
                    let timesheetEntriesForResource = timesheet_entries.filter(tse => tse.resource_id === r.type_id && tse.project_id === p.type_id);
                    allFridays.forEach((fr, i) => {
                        weeklyTimesheetForResource[i] = timesheetEntriesForResource.filter(
                            tse => moment(tse.date).isSameOrBefore(moment(fr)) && (i == 0 || moment(tse.date).isAfter(moment(allFridays[i - 1])))
                        );
                    });
                    timesheetsPerProjectPerResourcePerWeek[indexofProjectArr]["resources"][n]["timesheets"] = weeklyTimesheetForResource;
                });
            });

            timesheetsPerProjectPerResourcePerWeek = timesheetsPerProjectPerResourcePerWeek.sort((a, b) => a.name.localeCompare(b.name));

            console.log(timesheetsPerProjectPerResourcePerWeek);

        }

        return (
            <div>
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <colgroup><col /></colgroup>
                        <colgroup><col /></colgroup>
                        <colgroup span={allFridays.length}></colgroup>
                        <colgroup><col /></colgroup>
                        <thead>
                            <tr>
                                <th scope="col">Project Name</th>
                                <th scope="col">Resources</th>
                                <th colSpan={allFridays.length} scope="colgroup">Utilization per week (hours)</th>
                                <th colSpan={allFridays.length} scope="colgroup">Weekly Project Utilization (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="2"></td>
                                {
                                    allFridays && allFridays.map(a =>
                                        (
                                            <th key={a} scope="col">{moment(a).format("Do MMM YY")}</th>
                                        ))

                                }
                                {
                                    allFridays && allFridays.map(a =>
                                        (
                                            <th key={a} scope="col">{moment(a).format("Do MMM YY")}</th>
                                        ))

                                }
                            </tr>

                        </tbody>

                        {
                            timesheetsPerProjectPerResourcePerWeek && timesheetsPerProjectPerResourcePerWeek.map(p => {

                                let weeklySum = []
                                p["resources"].forEach(r => {
                                    r["timesheets"].forEach((arr, i) => {
                                        let sum = 0;
                                        arr.forEach(tse => sum += tse.hours);
                                        weeklySum[i] = weeklySum[i] ? weeklySum[i] + sum : sum;
                                    });
                                });

                                return (
                                    
                                    <tbody key={p.type_id}>
                                        {
                                            p["resources"].length > 0 &&
                                        
                                        <tr>
                                            <td rowSpan={p["resources"].length + 1} scope="rowgroup">
                                                {p.name}
                                            </td>
                                        </tr>
                                        }
                                        {
                                          p["resources"].length > 0 && p["resources"].map((r, i) =>
                                                (
                                                    <tr key={i}>
                                                        <td scope="row">{r.name}</td>
                                                        {
                                                            r["timesheets"].map((arr, j) => {
                                                                if (!arr || arr.length == 0) {
                                                                    return (<td key={j}>0</td>);
                                                                }

                                                                let sum = 0;

                                                                for (let m = 0; m < arr.length; m++) {
                                                                    sum += arr[m].hours;
                                                                }

                                                                return (
                                                                    <td key={j}>
                                                                        {sum}
                                                                    </td>
                                                                )
                                                            })
                                                        }
                                                        {this.showWeeklyUtilization(p, weeklySum, i)}

                                                    </tr>
                                                )
                                            )
                                        }
                                    </tbody>
                                );
                            }
                            )
                        }
                    </table>
                </div>
            </div>
        );
    }
}

export default withApollo(compose(

    graphql(gql(queryItemsLatestVersionByType), {
        options: () => ({
            variables: { type: 'resource' },
            fetchPolicy: 'cache-first'
        }),
        props: ({ data: { queryItemsLatestVersionByType = { items: [] } } }) => ({
            resources: queryItemsLatestVersionByType.items
        })
    }),

    graphql(gql(queryItemsLatestVersionByType), {
        options: () => ({
            variables: { type: 'timesheet' },
            fetchPolicy: 'cache-first'
        }),
        props: ({ data: { queryItemsLatestVersionByType = { items: [] } } }) => ({
            timesheet_entries: queryItemsLatestVersionByType.items
        })
    }),


    graphql(
        gql(queryItemsLatestVersionByType),
        {
            options: () => ({
                variables: { type: 'allocation' },
                fetchPolicy: 'cache-first',
            }),
            props: ({ data: { queryItemsLatestVersionByType = { items: [] } } }) => ({
                proj_res_links: queryItemsLatestVersionByType.items
            }),
        }),

    graphql(
        gql(queryItemsLatestVersionByType),
        {
            options: () => ({
                variables: { type: 'project' },
                fetchPolicy: 'cache-first',
            }),
            props: ({ data: { queryItemsLatestVersionByType = { items: [] } } }) => ({
                projects: queryItemsLatestVersionByType.items
            }),
        }
    )
)(ProjectUtilization));