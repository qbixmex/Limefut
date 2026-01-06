import { cn } from "~/src/lib/utils";
import { socialMedia } from "./data/social-media";
import "./styles.css";

export const SocialMedia = () => {
  return (
    <div className="social-media">
      {socialMedia.filter((item) => item.active).map((item) => (
        <div key={item.id} className="social-link">
          <a href={item.url} target="_blank">
            <item.icon className={cn(["social-icon", item.css])} />
          </a>
        </div>
      ))}
    </div>
  );
};

export default SocialMedia;