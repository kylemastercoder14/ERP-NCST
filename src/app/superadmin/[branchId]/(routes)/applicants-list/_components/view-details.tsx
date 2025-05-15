/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Items } from "@prisma/client";
import React from "react";
import { getItemById } from "@/actions";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const ViewItemDetails = ({ id }: { id: string }) => {
  const [item, setItem] = React.useState<Items | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await getItemById(id);
        if (res.error) {
          toast.error(res.error);
        }
        setItem(res.item ?? null);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading)
    return (
      <div>
        <Loader className="size-5 animate-spin" />
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  if (!item) return <div>No item found.</div>;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Name:</p>
          <p>{item.name}</p>
        </div>
        <div>
          <p className="font-semibold">Unit Price:</p>
          <p>₱{item.unitPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold">Small Item:</p>
          <p>{item.isSmallItem ? "Yes" : "No"}</p>
        </div>
        <div>
          <p className="font-semibold">Date Created:</p>
          <p>{new Date(item.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="mt-3">
        <p className="font-semibold">Description:</p>
        <p>{item.description || "No description"}</p>
      </div>
      <div className="mt-3">
        <p className="font-semibold">Specification:</p>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: item.specification || "<p>No specification</p>",
          }}
        />
      </div>
    </div>
  );
};

export default ViewItemDetails;
