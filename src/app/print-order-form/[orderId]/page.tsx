
import db from "@/lib/db";
import PrintOrderFormClient from './client';

const Page = async (props: {
	params: Promise<{
	  orderId: string;
	}>;
  }) => {
  const params = await props.params;

  const purchaseRequest = await db.purchaseRequest.findUnique({
	where: { id: params.orderId },
	include: {
	  receivedEmployee: true,
	  requestedBy: true,
	  PurchaseRequestItem: {
		include: {
		  Item: {
			include: { Supplier: true },
		  },
		},
	  },
	},
  });

  if (!purchaseRequest) return <div>Not found</div>;

  return <PrintOrderFormClient data={purchaseRequest} />;
};

export default Page;
