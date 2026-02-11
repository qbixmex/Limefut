'use client';

import type { FC } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ALIGNMENT, type ALIGNMENT_TYPE } from "@/shared/enums";
import { updateHeroBannerAlignmentAction } from "../../(actions)/updateHeroBannerAlignmentAction";

type Props = Readonly<{
  bannerId: string;
  alignment: ALIGNMENT_TYPE;
}>;

export const BannerAlignment: FC<Props> = ({ bannerId, alignment }) => {
  const onUpdateAlignment = async (newAlignment: ALIGNMENT_TYPE) => {
    const response = await updateHeroBannerAlignmentAction(bannerId, newAlignment);

    if (response.ok) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <Select
      defaultValue={alignment}
      onValueChange={onUpdateAlignment}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={ALIGNMENT.LEFT}>izquierda</SelectItem>
          <SelectItem value={ALIGNMENT.CENTER}>centro</SelectItem>
          <SelectItem value={ALIGNMENT.RIGHT}>derecha</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
