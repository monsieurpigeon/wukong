import { useEffect, useState } from "react";

export default function Stats() {
  const [stats, setStats] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetch("/stats.csv")
      .then((r) => r.text())
      .then((stats) => {
        const result = stats.split("\n").reduce((acc, line, index) => {
          const [key] = line.split(",");
          acc[key] = index;
          return acc;
        }, {} as { [key: string]: number });

        setStats(result);
      });
  }, []);

  return (
    <div>
      <div>
        <div className="grid grid-cols-12 w-fit m-auto gap-2 p-8">
          {Object.keys(stats).map((key) => {
            return (
              <>
                <div
                  key={key}
                  className="text-xl bg-card border rounded p-2 shadow hover:scale-125 transition-all cursor-pointer"
                >
                  {key}
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}
