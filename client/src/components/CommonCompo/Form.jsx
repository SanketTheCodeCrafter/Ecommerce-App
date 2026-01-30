import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

const Form = ({
    formControls,
    formData,
    setFormData,
    onSubmit,
    buttonText,
    isBtnDisabled,
    isLoading = false,
}) => {

    function renderInputsByComponentType(getControlItem) {
        let element = null;
        const value = formData[getControlItem.name] ||
            "";

        switch (getControlItem.componentType) {
            case "input":
                element = (
                    <Input
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        id={getControlItem.name}
                        value={value}
                        type={getControlItem.type}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                [getControlItem.name]: e.target.value,
                            })
                        }}
                    />
                )
                break;

            case "select":
                element = (
                    <Select
                        value={value}
                        onValueChange={(value) =>
                            setFormData({
                                ...formData,
                                [getControlItem.name]: value,
                            })
                        }
                    >
                        <SelectTrigger className={"w-full"}>
                            <SelectValue placeholder={getControlItem.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {getControlItem.options && getControlItem.options.length > 0
                                ? getControlItem.options.map((option) => (
                                    <SelectItem key={option.id} value={option.id}>
                                        {option.label}
                                    </SelectItem>
                                ))
                                : null}
                        </SelectContent>
                    </Select>
                )
                break;

            case "textarea":
                element = (
                    <Textarea
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        id={getControlItem.name}
                        value={value}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                [getControlItem.name]: e.target.value,
                            })
                        }}
                    />
                )
                break;

            default:
                element = (
                    <Input
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        id={getControlItem.name}
                        value={value}
                        type={getControlItem.type}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                [getControlItem.name]: e.target.value,
                            })
                        }}
                    />
                )
                break;
        }

        return element;
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-3">
                {formControls.map((controlItem) => (
                    <div className="grid w-full gap-1.5" key={controlItem.name}>
                        <Label className={"mb-1"}>
                            {controlItem.label}
                        </Label>
                        {renderInputsByComponentType(controlItem)}
                    </div>
                ))}
            </div>

            <Button disabled={isBtnDisabled || isLoading} type="submit" className={"mt-2 w-full"}>
                {isLoading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {buttonText || "Submit"}
            </Button>
        </form>
    )
}

export default Form