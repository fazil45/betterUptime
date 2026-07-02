import { prisma } from "@repo/db/client";
import { xADD, xADDBulk } from "@repo/redis";

async function main() {
  const website = await prisma.website.findMany({
    select: {
      url: true,
      id: true,
    },
  });

  await xADDBulk(
    website.map((w) => ({
      url: w.url,
      id: w.id,
    })),
  );
}

setInterval(() => {
    main()
},3 * 1000)

main();
