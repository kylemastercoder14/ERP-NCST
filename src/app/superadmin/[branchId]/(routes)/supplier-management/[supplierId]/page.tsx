import React from "react";
import db from "@/lib/db";
import SupplierForm from '@/components/forms/supplier-form';

const Page = async (props: {
  params: Promise<{
	supplierId: string;
  }>;
}) => {
  const params = await props.params;
  const supplier = await db.supplier.findUnique({
	where: {
	  id: params.supplierId,
	},
  });

  return (
	<div>
	  <SupplierForm initialData={supplier} />
	</div>
  );
};

export default Page;
