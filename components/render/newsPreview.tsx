import styles from "@styles/News.module.css";

interface NewsPreviewProps {
  data: {
    image: string;
    title: string;
    description: string;
    author: string;
    createdAt: string;
    url: string;
  };
}

export default function NewsPreview({ data }: NewsPreviewProps) {
  const date = new Date(Date.parse(data.createdAt));
  return (
    //bg-[#1b0b43] text-[#E6E6E6]
    <div className=" w-[330px] h-128 flex flex-col">
      <div className="flex-1">
        <div className="w-[330px] h-[220px] rounded-xl overflow-hidden">
          <img src={data.image} alt="News Image" className=" object-cover w-[330px] h-[220px]"/>
        </div>

        <span className={styles.Palanquin}>
          {/* text-[#F0DCF9] */}
          <span className="inline-flex gap-2  text-[13px] mx-2 mt-4">
            <span>{data.author}</span>
            <span>·</span>
            <span>{date.toDateString()}</span>
          </span>
        </span>

        <h1 className="text-3xl mx-2 leading-7 mb-2">
          <span className={styles.heebo}>{data.title}</span>
        </h1>

        <div className="mx-2 overflow-hidden max-h-40 text-left leading-4">
          <div className={styles.Palanquin}>{data.description}</div>
        </div>
      </div>
      <div className="flex justify-center mb-4">
        <a href={data.url}>
          <button className="hover:border hover:border-pink-500 border border-[#1b0b43] rounded-2xl px-[32px] py-[10px] bg-gradient-to-r from-[#BD8FDC] to-[#3E89FA]">
            <span className={styles.Palanquin}>Read more</span>
          </button>
        </a>
      </div>
    </div>
  );
}
