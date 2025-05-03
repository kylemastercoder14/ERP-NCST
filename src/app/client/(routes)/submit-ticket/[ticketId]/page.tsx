import db from "@/lib/db";
import { useClient } from "@/hooks/use-client";
import TicketForm from "@/components/forms/ticket-form";

interface PageProps {
  params: {
    ticketId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useClient();
  const ticket = await db.ticket.findUnique({
    where: {
      id: params.ticketId,
    },
    include: {
      employee: true,
    },
  });

  const employees = await db.employee.findMany({
    where: {
      clientId: user?.id,
    },
  });

  return (
    <div>
      <TicketForm employees={employees} initialData={ticket} />
    </div>
  );
};

export default Page;
