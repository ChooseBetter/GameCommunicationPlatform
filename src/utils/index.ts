import LocalCache from "./cache";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

class Utils {
  LocalCache() {
    return LocalCache;
  }
  randomSeed(seed: number, max?: number, min?: number) {
    max = max || 1;
    min = min || 0;
    seed = (seed * 9301 + 49297) % 233280;
    var rnd = seed / 233280.0;
    return min + rnd * (max - min);
  }
  formatDate(utcString: string, format: string = DATE_TIME_FORMAT) {
    dayjs.extend(utc);
    return dayjs.utc(utcString).utcOffset(8).format(format);
  }
  // 密码加密操作
  encryptAction = (md5: any, password: string) => {
    const salt = this.randomSeed(2.28);
    md5.appendStr(password + salt);
    return md5.end() as string;
  };
  // 将对象转换成query字符串
  handlQueryeUrl(obj: any) {
    let query = "";
    for (let key in obj) {
      let value = obj[key];
      if (Array.isArray(value)) {
        value = value.join(",");
      }
      query += `&${key}=${value}`;
    }
    query = query.replace("&", "?");
    return query;
  }
  // 处理经验显示()
  handleExperience(experience: number) {
    return [Math.floor(experience / 50) + 1, experience % 50];
  }
}

export default new Utils();
