import { addDays, format, getDay, parseISO, startOfWeek } from "date-fns";
import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const RevenueLineChart = ({ lineData, ticketPrice }) => {
  if (!lineData || lineData.length === 0) {
    // Create a default weekData array with 0 revenue for all days
    const today = new Date();
    const weekStartsOn = getDay(today);
    const startDate = startOfWeek(today, { weekStartsOn });

    weekData = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(startDate, i);
      return {
        label: format(date, "EEE"),
        value: 0,
        dataPointText: "0",
      };
    });
    weekData.push({ label: "*", value: 10, dataPointText: "0" });
  } else {
    // Parse the first date and determine the day of the week
    const firstDate = parseISO(lineData[0].date);
    const weekStartsOn = getDay(firstDate);

    // Get the start of the week based on the first date's day
    const startDate = startOfWeek(firstDate, { weekStartsOn });

    // Create an array for the entire week with default revenue of 0
    weekData = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(startDate, i);
      return {
        label: format(date, "EEE"),
        value: 0,
        dataPointText: "0",
      };
    });

    // Fill in the actual revenue data
    lineData.forEach((item) => {
      const date = parseISO(item.date);
      const dayIndex = getDay(date);
      const weekDayIndex = (dayIndex - weekStartsOn + 7) % 7; // Adjust index based on week start day
      weekData[weekDayIndex].value = item.tickets_sold * ticketPrice;
      weekData[weekDayIndex].dataPointText = (
        item.tickets_sold * ticketPrice
      ).toString();
    });
  }
  return (
    <View>
      <LineChart
        initialSpacing={10}
        data={weekData}
        spacing={50}
        curved
        thickness={2}
        hideRules
        noOfSections={5}
        xAxisLabelTextStyle={{ color: "white" }}
        yAxisTextStyle={{ color: "white" }}
        color={"rgba(200, 100, 244,0.8)"}
      />
    </View>
  );
};
export default RevenueLineChart;
