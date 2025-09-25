import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  relation: z.string().min(2, { message: "Relation must be at least 2 characters." }),
  abhaId: z.string().regex(/^\d{2}-\d{4}-\d{4}-\d{4}$/, { message: "Invalid ABHA ID format (e.g., 12-3456-7890-1234)." }),
});

export type FamilyMemberFormData = z.infer<typeof formSchema>;

interface AddFamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (data: FamilyMemberFormData) => void;
}

const AddFamilyMemberModal = ({ isOpen, onClose, onAddMember }: AddFamilyMemberModalProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FamilyMemberFormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FamilyMemberFormData) => {
    onAddMember(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Family Member</DialogTitle>
          <DialogDescription>
            Enter the details of the new family member. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" {...register("name")} className="col-span-3" />
              {errors.name && <p className="col-span-4 text-destructive text-sm text-right mt-1">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="relation" className="text-right">
                Relation
              </Label>
              <Input id="relation" {...register("relation")} className="col-span-3" />
               {errors.relation && <p className="col-span-4 text-destructive text-sm text-right mt-1">{errors.relation.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="abhaId" className="text-right">
                ABHA ID
              </Label>
              <Input id="abhaId" {...register("abhaId")} className="col-span-3" placeholder="12-3456-7890-1234" />
              {errors.abhaId && <p className="col-span-4 text-destructive text-sm text-right mt-1">{errors.abhaId.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="btn-primary">Save Member</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFamilyMemberModal;
