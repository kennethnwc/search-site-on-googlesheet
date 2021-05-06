import { Fragment } from "react";

type Props = {
  raw: { [key: string]: string | string[] };
  id: string;
};

export const ItemCard: React.FC<Props> = ({ raw, id }) => {
  const { title, year, author, abstract, subject, ...items } = raw;
  return (
    <div className="shadow-xl bg-white rounded-lg p-6 my-6">
      <div>
        <h1 className="mb-2 text-gray-700">{title}</h1>
        <div className="flex flex-row flex-wrap">
          {subject && typeof subject === "string" && (
            <Badge content={subject}></Badge>
          )}
          {subject &&
            typeof subject === "object" &&
            subject.map((content) => {
              return (
                <Fragment key={`${id}-${content}`}>
                  <Badge content={content} />
                  <div className="ml-2"></div>
                </Fragment>
              );
            })}
        </div>

        <p className="text-grey-600 text-sm">{abstract}</p>
      </div>
    </div>
  );
};

const Badge: React.FC<{ content: string }> = ({ content, ...props }) => (
  <button className="bg-teal-500 text-white text-xs px-2 rounded-sm" {...props}>
    {content}
  </button>
);
