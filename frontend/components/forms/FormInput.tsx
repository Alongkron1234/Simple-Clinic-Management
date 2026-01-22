
type FormInputProps = {
    name: string;
    type: string;
    label?: string;
    defaultValue?: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // เพิ่มอันนี้เพื่อรับค่าการพิมพ์
    required?: boolean;
};
const FormInput = (props: FormInputProps) => {
    const { name, type, label, defaultValue, placeholder, onChange, required = true } = props
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                name={name}
                type={type}
                defaultValue={defaultValue}
                placeholder={placeholder}
                onChange={onChange}
                required={required}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
        </div>
    )
}
export default FormInput