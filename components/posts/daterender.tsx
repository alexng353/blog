interface DateRenderProps {
  date: Date;
}
export default function DateRender({ date }: DateRenderProps) {
  // custom date format, include time to minute accuracy
  const dateString = date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  return <>{dateString}</>;
}
