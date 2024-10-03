import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { format, startOfWeek, addDays, getDay, parseISO, Day } from "date-fns";

const SalesBarChart = ({ barData }) => {
  let weekData = [];
  if (!barData || barData.length === 0) {
    // Create a default weekData array with 0 tickets sold for all days
    const today = new Date();
    const weekStartsOn = getDay(today);
    const startDate = startOfWeek(today, { weekStartsOn });

    weekData = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(startDate, i);
      return {
        label: format(date, "EEE"),
        value: 0,
      };
    });

    weekData.push({ label: "*", value: 10 });
  } else {
    // Parse the first date and determine the day of the week
    const firstDate = parseISO(barData[0].date);
    const weekStartsOn = getDay(firstDate);

    // Get the start of the week based on the first date's day
    const startDate = startOfWeek(firstDate, { weekStartsOn });

    // Create an array for the entire week with default sales of 0
    weekData = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(startDate, i);
      return {
        label: format(date, "EEE"),
        value: 0,
      };
    });

    // Fill in the actual sales data
    barData.forEach((item) => {
      const date = parseISO(item.date);
      const dayIndex = getDay(date);
      const weekDayIndex = (dayIndex - weekStartsOn + 7) % 7; // Adjust index based on week start day
      weekData[weekDayIndex].value = item.tickets_sold;
    });
  }

  return (
    <View>
      <BarChart
        data={weekData}
        noOfSections={5}
        cappedBars
        capColor={"rgba(78, 0, 142)"}
        showGradient
        gradientColor={"rgba(200, 100, 244,0.8)"}
        frontColor={"rgba(219, 182, 249,0.2)"}
        barWidth={25}
        xAxisLabelTextStyle={{ color: "white" }}
        yAxisTextStyle={{ color: "white" }}
      />
    </View>
  );
};
export default SalesBarChart;
