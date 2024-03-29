import { Box, Button, Checkbox, DrawerHeader, Flex, Heading, Icon, Link, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { RiAddLine } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination/index";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { useUsers } from "../../services/hooks/useUsers";
import { queryClient } from "../../services/queryClient";

export default function UserList() {
    const [ page, setPage ] = useState(1)
    const { data, isLoading, isFetching, error } = useUsers(page)

    async function handlePrefetchUser(userId: string) {
        await queryClient.prefetchQuery(['user', userId], async () => {
            const response = await api.get(`users/${userId}`)

            return response.data
        }, {
            staleTime: 1000 * 60 * 10 // 10 min
        }) 
    }

    return (
        <Box>
            <Header />

            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
                <Sidebar />

                <Box maxWidth={"100%"} overflow={['scroll', 'auto']} flex="1" borderRadius={8} bg="gray.800" p="8">
                    <Flex mb="8" justify="space-between" align='center'>
                        <Heading size="lg" fontWeight="normal">
                            Usuários
                            { !isLoading && isFetching && <Spinner size={'sm'} color='gray.500' ml='4'/>}    
                        </Heading>

                        <NextLink passHref href="/users/create">
                            <Button
                                as="a"
                                size="sm"
                                fontSize="sm"
                                colorScheme="pink"
                                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                            >
                                Criar novo usuário
                            </Button>
                        </NextLink>
                    </Flex>

                    {isLoading ? (
                        <Flex justify={'center'}>
                            <Spinner />
                        </Flex>
                    ) : error ? (
                        <Flex justify={'center'}>
                            <Text>Falha ao obter os dados do usuário</Text>
                        </Flex>
                    ) : (
                        <>
                            <Table colorScheme="whiteAlpha">
                                <Thead>
                                    <Tr>
                                        <Th px={6} color="gray.300" width={8}>
                                            <Checkbox colorScheme="pink" />
                                        </Th>
                                        <Th>Usuário</Th>
                                        <Th>Data de cadastro</Th>
                                        <Th w="8"></Th>
                                    </Tr>
                                </Thead>

                                <Tbody>
                                    {data.users.map(user => (
                                        <Tr key={user.id}>
                                            <Td px={6}>
                                                <Checkbox colorScheme="pink" />
                                            </Td>
                                            <Td>
                                                <Box>
                                                    <Link 
                                                        color={'purple.400'} 
                                                        onMouseEnter={() => handlePrefetchUser(user.id)}>
                                                        <Text fontWeight="bold">{user.name}</Text>
                                                    </Link>
                                                    <Text fontSize="sm" color="gray.300" >{user.email}</Text>
                                                </Box>
                                            </Td>
                                            <Td>{user.createdAt}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>

                            <Pagination 
                                onPageChange={setPage}
                                totalCountOfRegisters={data.totalCount}
                                currentPage={page}
                            />
                        </>
                    )}
                </Box>
            </Flex>
        </Box>
    )
}