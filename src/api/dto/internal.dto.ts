export type TweetDetailsDto = {
  id_str: string;

  lang: string;
  created_at: string;
  text: string;

  user: {
    id_str: string;
    name: string;
    profile_image_url_https: string;
    screen_name: string;
  };

  video: {
    poster: string;
    variants: {
      type: string;
      src: string;
    }[];
  };

  photos: {
    backgroundColor: {
      red: number;
      green: number;
      blue: number;
    };
    expandedUrl: string;
    url: string;
    width: number;
    height: number;
  }[];

  parent?: TweetDetailsDto;
};
