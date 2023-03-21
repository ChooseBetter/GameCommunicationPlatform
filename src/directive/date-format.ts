import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export function formatUtcString(
  utcString: string,
  format: string = DATE_TIME_FORMAT
) {
  return dayjs.utc(utcString).utcOffset(8).format(format);
}

export default {
  mounted(el: any, binding: any) {
    let format = binding.value ? binding.value : DATE_TIME_FORMAT;
    let utcString = el.innerText;
    let res = "";
    res = dayjs.utc(utcString).utcOffset(8).format(format);
    el.innerText = res;
  },
};
