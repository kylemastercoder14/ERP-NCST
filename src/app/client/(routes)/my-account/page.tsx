import React from "react";
import db from "@/lib/db";
import { useClient } from '@/hooks/use-client';
import ChangeAccountForm from './client';

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useClient();
  const client = await db.client.findUnique({
	where: {
	  id: user?.id
	},
  });

  return (
	<div className=''>
	  <ChangeAccountForm initialData={client} />
	</div>
  );
};

export default Page;
