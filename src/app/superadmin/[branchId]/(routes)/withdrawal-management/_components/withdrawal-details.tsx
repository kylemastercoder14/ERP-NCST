"use client";

import React from "react";
import { WithdrawalWithProps } from "@/types";
import { getWithdrawalById, updateWithdrawalStatus } from "@/actions";
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

const WithdrawalDetails = ({
  id,
  departmentSession,
  initialStatus,
}: {
  id: string;
  departmentSession: string;
  initialStatus: string;
}) => {
  const [withdrawalItem, setWithdrawalItem] =
    React.useState<WithdrawalWithProps | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [loading2, setLoading2] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [remarks, setRemarks] = React.useState("");

  React.useEffect(() => {
    const fetchWithdrawal = async () => {
      setLoading(true);
      try {
        const res = await getWithdrawalById(id);
        if (res.withdrawal) {
          setWithdrawalItem(res.withdrawal);
        } else {
          console.error(res.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchWithdrawal();
  }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading2(true);
    try {
      if (status === "Rejected" && !remarks) {
        toast.error("Remarks is required when rejecting a withdrawal.");
        return;
      }
      const res = await updateWithdrawalStatus(id, status, remarks);
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
              {withdrawalItem?.WithdrawalItem.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.Item ? item.Item.name : "N/A"}</TableCell>
                  <TableCell>
                    {item.Item
                      ? `₱${item.Item.unitPrice.toLocaleString()}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
      {(departmentSession === "Inventory" && initialStatus === "Pending") && (
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
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
      )}
    </>
  );
};

export default WithdrawalDetails;
