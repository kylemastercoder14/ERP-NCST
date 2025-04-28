import db from "@/lib/db";
import WithdrawalSlipClient from "./client";

const Page = async (props: {
  params: Promise<{
    orderId: string;
  }>;
}) => {
  const params = await props.params;

  const withdrawal = await db.withdrawal.findUnique({
    where: { id: params.orderId },
    include: {
      Employee: true,
      WithdrawalItem: {
        include: {
          Item: {
            include: { Supplier: true },
          },
        },
      },
    },
  });

  if (!withdrawal) return <div>Not found</div>;

  return <WithdrawalSlipClient data={withdrawal} />;
};

export default Page;
