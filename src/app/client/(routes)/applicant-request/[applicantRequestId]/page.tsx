import db from "@/lib/db";
import { useClient } from "@/hooks/use-client";
import ApplicantRequestForm from "@/components/forms/applicant-request-form";

const Page = async (props: {
  params: Promise<{
    applicantRequestId: string;
  }>;
}) => {
  const params = await props.params;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useClient();
  const applicantRequest = await db.applicantRequest.findUnique({
    where: {
      id: params.applicantRequestId,
      clientId: user?.id,
    },
    include: {
      genderRequirements: true,
    },
  });

  return (
    <div>
      <ApplicantRequestForm
        initialData={applicantRequest}
        clientId={user?.id as string}
      />
    </div>
  );
};

export default Page;
