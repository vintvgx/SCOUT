import React from "react";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { SentryItem } from "../model/issue";

const screenWidth = Dimensions.get("window").width;

interface ProjectPieChartType {
  errors: SentryItem[];
  issues: SentryItem[];
  //   newIssues: SentryItem[];
}

const ProjectPieChart: React.FC<ProjectPieChartType> = ({
  errors,
  issues,
  //   newIssues,
}) => {
  const data = [
    {
      name: "Errors",
      count: errors.length,
      color: "red",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Issues",
      count: issues.length,
      color: "blue",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    // {
    //   name: "New Issues",
    //   count: newIssues.length,
    //   color: "green",
    //   legendFontColor: "#7F7F7F",
    //   legendFontSize: 15,
    // },
  ];

  return (
    <PieChart
      data={data}
      width={200}
      height={100}
      chartConfig={{
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#fb8c00",
        backgroundGradientTo: "#ffa726",
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      }}
      accessor="count"
      backgroundColor="transparent"
      paddingLeft="15"
      absolute
    />
  );
};

export default ProjectPieChart;
