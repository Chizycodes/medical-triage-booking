import { memo } from "react";
import Button from "../ui/Button";
import { formatSlotShort } from "../../utils";

interface SlotButtonProps {
	slot: string;
	isSelected: boolean;
	onSelect: (slot: string) => void;
}

const SlotButton = memo(({ slot, isSelected, onSelect }: SlotButtonProps) => (
	<Button
		onClick={() => onSelect(slot)}
		className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all duration-150 shadow-none hover:text-white!
      ${
				isSelected
					? "border-brand bg-white text-brand!"
					: "border-border bg-white text-text-secondary! hover:border-brand"
			}`}
	>
		{formatSlotShort(slot)}
	</Button>
));

SlotButton.displayName = "SlotButton";

export default SlotButton;
