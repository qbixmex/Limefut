import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const ActiveField = () => {
  return (
    <FormField
      name="active"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-3">
            <Label htmlFor="active">Activo</Label>
            <FormControl>
              <Switch
                id="active"
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </div>
        </FormItem>
      )}
    />
  );
};
