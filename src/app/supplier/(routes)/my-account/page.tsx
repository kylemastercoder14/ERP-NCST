import React from "react";
import db from "@/lib/db";
import { useSupplier } from '@/hooks/use-supplier';
import ChangeAccountForm from './client';

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useSupplier();
  const supplier = await db.supplier.findUnique({
	where: {
	  id: user?.id
	},
  });

  return (
	<div className=''>
	  <ChangeAccountForm initialData={supplier} />
	</div>
  );
};

export default Page;
