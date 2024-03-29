import { Button, Flex, Stack } from '@chakra-ui/react'
import { Input } from '../components/Form/Input'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

type SignInFormData = {
  email: string,
  password: string
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().required('Senha obrigatória')
})

export default function SignIn() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema)
  })

  const { errors } = formState

  const handleSignIn: SubmitHandler<SignInFormData> = async (data) => {

    console.log(data)
  }

  return (
    <Flex 
      w="100vw" 
      h="100vh" 
      align="center" 
      justify="center"
    >
      <Flex 
        as="form" 
        width="100%" 
        maxWidth="360px"
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleSignIn)}
    >
      <Stack spacing={4}>

        <Input 
          type="email" 
          name="email" 
          label='E-mail' 
          error={errors.email}
          {...register('email')}  
        />

        <Input 
          type="password" 
          name="password" 
          label="Senha" 
          error={errors.password}
          {...register('password')}  
        />

      </Stack>

         <Button 
          size="lg" 
          type='submit' 
          mt={6}
          colorScheme={'pink'}
          bg={'pink.600'}
          color={'#FFF'}
          isLoading={formState.isSubmitting}
        >
           Entrar
        </Button>
      </Flex>
    </Flex>
  )
}
