import { FormLabel, FormControl, Input as ChakraInput, InputProps as ChakraInputProps} from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from 'react-hook-form'

interface InputProps extends ChakraInputProps {
    name: string,
    label?: string,
    error?: FieldError 
}

const InputComponent: ForwardRefRenderFunction<
  HTMLInputElement, 
  InputProps
> = ({name, label, ...rest}, ref) => {
  return (
      <FormControl>
        { !!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

        <ChakraInput 
          id={name}
          name={name} 
          focusBorderColor='pink.500'
          bgColor="gray.900"
          variant="filled"
          _hover={{bgColor: 'gray.900'}}
          size="lg"
          {...rest}
          ref={ref}
        />
      </FormControl>
  )
}

export const Input = forwardRef(InputComponent)