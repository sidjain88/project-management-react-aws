import React, { Component } from 'react';
import {queryItemsLatestVersionByType} from "../graphql/queries";
import { graphql, compose, withApollo } from "react-apollo";
import gql from "graphql-tag";
import moment from "moment";

class ResourceUtilization extends Component {

    showWeeklyUtilization(resource, weeklySumArr, indexOfProjectsArr){
        if(indexOfProjectsArr === 0){
            return weeklySumArr.map((sum,i) => (
                <td key={i} rowSpan={resource["projects"].length} scope="rowgroup">
                    {parseFloat(100 * sum/40).toFixed(2)}
                </td>
            ));
        }
        else{
            return null;
        }
    }


    // Take a date input and return the date for upcoming friday for the week
    getFriday(date){
        if(moment(date).format('dddd') === "Friday")
        { return date;}
        else {
            let friday = moment(date);
            while(friday.format('dddd') !=="Friday"){
                friday = friday.add(1,"days");
            }
            return moment(friday).format("YYYY-MM-DD");
        }
    }


    render() {

        let {resources, timesheet_entries, proj_res_links, projects}  = this.props;

                let firstFriday = ""; // The first Friday for the timesheet entries
        let lastFriday = ""; // The last Friday for the timesheet entries
        let allFridays = [];
        let timesheetsPerResourcePerProjectPerWeek = [];

        if(timesheet_entries && timesheet_entries.length > 0){
        timesheet_entries = timesheet_entries.sort((a,b) => {
            const date1 =  moment(a.date, "YYYY-MM-DD");
            const date2 =  moment(b.date, "YYYY-MM-DD");
            if(date1.isAfter(date2)){
                return 1;
            } else if(date2.isAfter(date1)){
              return -1;
            }else{
                return 0;
            }
          });

          firstFriday = this.getFriday(timesheet_entries[0].date);
          lastFriday = this.getFriday(timesheet_entries[timesheet_entries.length - 1].date);

          allFridays[0] = firstFriday;
          while(allFridays[allFridays.length-1] !== lastFriday){
              allFridays.push(moment(allFridays[allFridays.length-1]).add(7,"days").format("YYYY-MM-DD"));
          }

        }


        if(resources && resources.length > 0 && timesheet_entries && timesheet_entries.length>0
            && projects && projects.length>0 && proj_res_links && proj_res_links.length>0
            ){

               resources = resources.sort((a,b) => a.name.localeCompare(b.name));

                resources.forEach((r, indexofResourceArr) => {

                    timesheetsPerResourcePerProjectPerWeek[indexofResourceArr] = Object.assign({},r);
                    timesheetsPerResourcePerProjectPerWeek[indexofResourceArr]["projects"] = [];

                    let projectsForResource = [];

                    let projectLinksForResource = proj_res_links.filter(prl => prl.resource_id === r.type_id);

                    projectLinksForResource.forEach(prl => {
						let project = projects.find(p => p.type_id === prl.project_id);
						if(!!project){
							projectsForResource.push(project);
						}
                    });

                    projectsForResource.forEach((p,n) => {

                        timesheetsPerResourcePerProjectPerWeek[indexofResourceArr]["projects"][n] = Object.assign({},p);

                        let weeklyTimesheetForProject = [];
                        let timesheetEntriesForProject = timesheet_entries.filter(tse => tse.project_id === p.type_id && tse.resource_id === r.type_id);
                        allFridays.forEach((fr, i) => {
                            weeklyTimesheetForProject[i] = timesheetEntriesForProject.filter(
                                tse => moment(tse.date).isSameOrBefore(moment(fr)) && (i==0 || moment(tse.date).isAfter(moment(allFridays[i-1])))
                                );
                        });
                        timesheetsPerResourcePerProjectPerWeek[indexofResourceArr]["projects"][n]["timesheets"] = weeklyTimesheetForProject;
                    });
                });

                timesheetsPerResourcePerProjectPerWeek = timesheetsPerResourcePerProjectPerWeek.sort((a,b) => a.name.localeCompare(b.name));

                console.log(timesheetsPerResourcePerProjectPerWeek);

        }

        return (
            <div>
<div className="table-responsive">
<table className="table table-bordered">
  <colgroup><col/></colgroup>
  <colgroup><col/></colgroup>
  <colgroup span={allFridays.length}></colgroup>
  <colgroup><col/></colgroup>
  <thead>
    <tr>
      <th scope="col">Resource Name</th>
      <th scope="col">Projects</th>
      <th colSpan={allFridays.length} scope="colgroup">Utilization per week (hours)</th>
      <th  colSpan={allFridays.length} scope="colgroup">Weekly Resource Utilization (%)</th>
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
          timesheetsPerResourcePerProjectPerWeek && timesheetsPerResourcePerProjectPerWeek.map(r => {
            
            let weeklySum=[]
            r["projects"].forEach(p => {
                p["timesheets"].forEach((arr, i) => {
                    let sum=0;
                    arr.forEach(tse => sum+=tse.hours);
                    weeklySum[i]=weeklySum[i] ? weeklySum[i]+sum : sum;
                });
            });

            return (
       
                <tbody key={r.type_id}>
                    <tr>
                        <td rowSpan={r["projects"].length+1} scope="rowgroup">
                            {r.name}
                        </td>
                    </tr> 
                        { 
                            r["projects"].map((p,i)=> 
                             (
                                <tr key={i}>
                                    <td scope="row">{p.name}</td>
                                    {
                                    p["timesheets"].map((arr,j) => {
                                            if(!arr || arr.length==0){
                                                return (<td key={j}>0</td>);
                                            }
        
                                            let sum = 0;
        
                                            for(let m=0;m<arr.length;m++){
                                                sum+=arr[m].hours;
                                            }
        
                                            return (
                                                <td key={j}>
                                                    {sum}
                                                </td>
                                            ) 
                                        })
                                    }
                                      {this.showWeeklyUtilization(r, weeklySum, i)}

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
			fetchPolicy: 'cache-and-network'
		}),
		props: ({ data: { queryItemsLatestVersionByType = { items: [] } } }) => ({
			resources: queryItemsLatestVersionByType.items
		})
	}),

	graphql(gql(queryItemsLatestVersionByType), {
		options: () => ({
			variables: { type: 'timesheet' },
			fetchPolicy: 'cache-and-network'
		}),
		props: ({ data: { queryItemsLatestVersionByType = { items: [] } } }) => ({
			timesheet_entries: queryItemsLatestVersionByType.items
		})
	}),


graphql(
    gql(queryItemsLatestVersionByType),
{
    options: () => ({
        variables: {type:'allocation'  },
        fetchPolicy: 'cache-and-network',
    }),
    props: ({ data: { queryItemsLatestVersionByType= {items: []} } }) => ({
        proj_res_links : queryItemsLatestVersionByType.items
    }),
}),

graphql(
    gql(queryItemsLatestVersionByType),
{
    options: () => ({
        variables: {type:'project'  },
        fetchPolicy: 'cache-and-network',
    }),
    props: ({ data: { queryItemsLatestVersionByType= {items: []} } }) => ({
        projects : queryItemsLatestVersionByType.items
    }),
}
)
)(ResourceUtilization));
