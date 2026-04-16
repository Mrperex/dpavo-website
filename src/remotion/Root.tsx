import { Composition } from "remotion";
import { DPavoPromo } from "./DPavoPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DPavoPromo"
      component={DPavoPromo}
      durationInFrames={1350}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  );
};
