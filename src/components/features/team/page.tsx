"use client";


const sections = [
  {
    title: "CO-CHAIRS",
    rows: [["AMANDA CAO"], ["MICHAEL KWON"], ["WILL WU"]],
  },
  {
    title: "FINANCE",
    rows: [
      ["DIRECTOR", "ASHMAAN SOHAIL"],
      ["OFFICER", "ELA AYDINER"],
    ],
  },
  {
    title: "FIRST YEAR REPS",
    rows: [
      ["MOUCTAR DLALLO"],
      ["SOMIAYA HASSAN"],
      ["LISA LI"],
      ["NISHI SHAH"],
    ],
  },
  {
    title: "LOGISTICS",
    rows: [
      ["DIRECTOR", "ARYAMAN BHATIA"],
      ["DIRECTOR", "VICTOR VONG"],
      ["OFFICER", "ABDEL-RAHMAN MOBARAK"],
      ["OFFICER", "FRANCOIS OLIVER"],
      ["OFFICER", "AHMED"],
      ["OFFICER", "JULIA TUN"],
    ],
  },
  {
    title: "MARKETING",
    rows: [
      ["DIRECTOR", "SUE OLIVEROS"],
      ["DIRECTOR", "ROUNIKA SAXENA"],
      ["OFFICER", "IVAN FANG"],
      ["OFFICER", "BRANDON YIP"],
    ],
  },
  {
    title: "OPERATIONS",
    rows: [
      ["DIRECTOR", "JEFFERY WU"],
      ["OFFICER", "RASTIN AGHIGHI"],
      ["OFFICER", "HARISH KANDAVELL"],
    ],
  },
  {
    title: "PARTNERSHIPS",
    rows: [
      ["DIRECTOR", "EASTAL LAW"],
      ["DIRECTOR", "KELVIN NGUYEN"],
      ["OFFICER", "JASON CHEN"],
      ["OFFICER", "JESHNA KANDURI"],
      ["OFFICER", "HARSH KALYANI"],
      ["OFFICER", "JOSE KERKETTA"],
      ["OFFICER", "MAIRA OPEL"],
    ],
  },
  {
    title: "TECH",
    rows: [
      ["DIRECTOR", "KOSI AMOBI-OLEKA"],
      ["DIRECTOR", "KUZEY BILGIN"],
      ["OFFICER", "TECHMENG AING"],
      ["OFFICER", "AAYUSH ARYAL"],
      ["OFFICER", "ISAAC FUNG"],
      ["OFFICER", "ALFONSO SINA"],
    ],
  },
];

export default function Credits() {
  return (
    <section className="credits-container flex h-screen w-full items-center justify-center bg-black text-white">
      {/* subtle fade top & bottom like a movie */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

      <div className="credits-scroll relative z-10 flex flex-col items-center gap-10 text-center">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h2 className="text-sm font-semibold tracking-[0.25em] text-[#facc15] sm:text-base">
              {section.title}
            </h2>

            <div className="space-y-1 text-xs sm:text-sm">
              {section.rows.map((row, idx) => (
                <div
                  key={idx}
                  className="flex justify-center gap-2 tracking-[0.12em]"
                >
                  {row.length === 2 ? (
                    <>
                      <span className="font-semibold text-[#fbbf24]">
                        {row[0]}
                      </span>
                      <span className="font-medium">{row[1]}</span>
                    </>
                  ) : (
                    <span className="font-medium">{row[0]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
