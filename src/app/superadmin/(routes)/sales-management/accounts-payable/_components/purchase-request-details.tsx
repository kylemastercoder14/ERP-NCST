"use client";

import React from "react";
import { PurchaseRequestWithProps } from "@/types";
import { getPurchaseRequestById, updatePurchaseRequestStatus } from "@/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const PurchaseRequestDetails = ({ id }: { id: string }) => {
  const [purchaseRequest, setPurchaseRequest] =
    React.useState<PurchaseRequestWithProps | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [loading2, setLoading2] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [remarks, setRemarks] = React.useState("");

  React.useEffect(() => {
    const fetchPurchaseRequest = async () => {
      setLoading(true);
      try {
        const res = await getPurchaseRequestById(id);
        if (res.purchaseRequest) {
          setPurchaseRequest(res.purchaseRequest);
        } else {
          console.error(res.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchaseRequest();
  }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading2(true);
    try {
      if (status === "Rejected" && !remarks) {
        toast.error("Remarks is required when rejecting a purchase request.");
        return;
      }
      const res = await updatePurchaseRequestStatus(id, status, remarks);
      if (res.success) {
        toast.success(res.success);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading2(false);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Sub-total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            <>
              {purchaseRequest?.PurchaseRequestItem.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.Item ? item.Item.name : "N/A"}</TableCell>
                  <TableCell>
                    {item.Item
                      ? `₱${item.Item.unitPrice.toLocaleString()}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    {item.Item
                      ? `₱${item.totalAmount.toLocaleString()}`
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-bold">
                  Grand Total:
                </TableCell>
                <TableCell className="font-bold">
                  ₱
                  {purchaseRequest?.PurchaseRequestItem.reduce((acc, item) => {
                    return acc + (item.totalAmount ?? 0);
                  }, 0).toLocaleString()}
                </TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label>
            Status <span className="text-red-600">*</span>
          </Label>
          <Select
            disabled={loading2}
            onValueChange={setStatus}
            defaultValue={status}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Approved">Approve</SelectItem>
              <SelectItem value="Rejected">Reject</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {status === "Rejected" && (
          <div className="space-y-1">
            <Label>
              Remarks <span className="text-red-600">*</span>
            </Label>
            <Textarea
              disabled={loading2}
              placeholder="Enter remarks here..."
              rows={4}
              className="resize-none"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        )}
        <Button disabled={loading2} type="submit">
          Save Changes
        </Button>
      </form>
    </>
  );
};

export default PurchaseRequestDetails;
