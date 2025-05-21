import React from "react";
import db from "@/lib/db";
import ClientForm from "@/components/forms/client-form";

const Page = async (props: {
  params: Promise<{
    clientId: string;
  }>;
}) => {
  const params = await props.params;
  const client = await db.client.findUnique({
    where: {
      id: params.clientId,
    },
    include: {
      Employee: true,
    },
  });

  return (
    <div>
      <ClientForm initialData={client} session="head" />
    </div>
  );
};

export default Page;
