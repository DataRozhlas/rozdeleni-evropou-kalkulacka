import * as XLSX from "xlsx";

const data = XLSX.readFile(
  "./data/TABULKY_STEM_pro_CRo_hlavni_soubor.xls",
  { dense: true },
);

const qs = data.Sheets["Sheet2"].reduce((acc, row, i) => {
  if (i > 2 && row[0]) {
    acc = [...acc, {
      q: row[0].v,
      a: [row.slice(9, 43).map((a) => a.v)],
    }];
  }
  if (i > 2 && row[0] === undefined && row[1].v !== "Počet") {
    acc[acc.length - 1].a.push(row.slice(9, 43).map((a) => a.v));
  }
  return acc;
}, []);

// const result = qs.map((item, index) => {
//   if ([5, 39, 40].includes(index)) {
//     const reversedA = item.a.reverse();
//     return { q: item.q, a: reversedA };
//   }
//   if ([42].includes(index)) {
//     return { q: item.q, a: [item.a[1], item.a[2], item.a[0]] };
//   }
//   if (
//     [54,
//       55,
//       56,
//       57,
//       58,
//       59,
//       60,
//       61,
//       62,
//       63,
//       64,
//     ].includes(index)
//   ) {
//     console.log(item)
//     return { q: item.q, a: [item.a[0], item.a[3], item.a[1], item.a[2]] };
//   }

//   return item;
// });

Bun.write("./data/qas.json", JSON.stringify(qs, null, 2));
