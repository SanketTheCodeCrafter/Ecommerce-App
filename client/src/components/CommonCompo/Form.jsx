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
                            {getControlItem.options && getControlItem.options.length > 0 ? getControlItem.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                    {option.label}
                                </SelectItem>
                            )) : null}
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

            <Button disabled={isBtnDisabled} type= "submit" className={"mt-2 w-full"}>
                {buttonText || "Submit"}
            </Button>
        </form>
    )
}

export default Form