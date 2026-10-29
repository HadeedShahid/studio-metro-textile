import { useEffect, useState } from 'react'
import { type ArrayOfObjectsInputProps, insert, set, setIfMissing, unset, useClient, useFormValue } from 'sanity'
import { Box, Button, Flex, Stack, Text, TextInput } from '@sanity/ui'
import { AddIcon, TrashIcon } from '@sanity/icons'
import { randomKey } from '@sanity/util/content'
import { apiVersion, fetchSpecLabels, type SpecLabels } from '../lib/specLabels'

type Spec = { _key: string; label?: string; value?: string }

const same = (a?: string, b?: string) => a?.trim().toLowerCase() === b?.trim().toLowerCase()

/**
 * Specifications as a plain two-column table. Each keystroke patches only the
 * cell it touches, and a button adds the rows the category expects (see
 * Specification labels on the category) that the product doesn't have yet.
 */
export function SpecificationsInput(props: ArrayOfObjectsInputProps<Spec>) {
    const { value = [], onChange, readOnly } = props
    const client = useClient({ apiVersion })
    const categoryId = (useFormValue(['category']) as { _ref?: string } | undefined)?._ref
    const [expected, setExpected] = useState<SpecLabels | null>(null)

    useEffect(() => {
        if (!categoryId) {
            setExpected(null)
            return
        }
        let current = true
        fetchSpecLabels(client, categoryId)
            .then((result) => current && setExpected(result))
            .catch(() => current && setExpected(null))
        return () => {
            current = false
        }
    }, [client, categoryId])

    const missing = (expected?.labels ?? []).filter((label) => !value.some((row) => same(row.label, label)))

    const addRows = (labels: string[]) =>
        onChange([
            setIfMissing([]),
            insert(
                labels.map((label) => ({ _key: randomKey(12), ...(label ? { label } : {}) })),
                'after',
                [-1],
            ),
        ])

    const setCell = (key: string, field: 'label' | 'value', text: string) =>
        onChange(text ? set(text, [{ _key: key }, field]) : unset([{ _key: key }, field]))

    return (
        <Stack space={3}>
            {value.length > 0 ? (
                <Stack space={2}>
                    <Flex gap={2} paddingRight={6}>
                        <Box flex={1}>
                            <Text size={1} weight="medium" muted>Label</Text>
                        </Box>
                        <Box flex={2}>
                            <Text size={1} weight="medium" muted>Value</Text>
                        </Box>
                    </Flex>
                    {value.map((row) => (
                        <Flex key={row._key} gap={2} align="center">
                            <Box flex={1}>
                                <TextInput
                                    value={row.label ?? ''}
                                    placeholder="e.g. Material"
                                    readOnly={readOnly}
                                    onChange={(e) => setCell(row._key, 'label', e.currentTarget.value)}
                                />
                            </Box>
                            <Box flex={2}>
                                <TextInput
                                    value={row.value ?? ''}
                                    placeholder={row.label ? `Enter ${row.label.toLowerCase()}` : 'Value'}
                                    readOnly={readOnly}
                                    onChange={(e) => setCell(row._key, 'value', e.currentTarget.value)}
                                />
                            </Box>
                            <Button
                                icon={TrashIcon}
                                mode="bleed"
                                tone="critical"
                                disabled={readOnly}
                                aria-label={`Remove ${row.label || 'row'}`}
                                onClick={() => onChange(unset([{ _key: row._key }]))}
                            />
                        </Flex>
                    ))}
                </Stack>
            ) : (
                <Text size={1} muted>No specifications yet.</Text>
            )}

            <Flex gap={2} wrap="wrap">
                {missing.length > 0 && (
                    <Button
                        icon={AddIcon}
                        mode="ghost"
                        tone="primary"
                        disabled={readOnly}
                        text={`Add ${missing.join(', ')} (from ${expected?.from})`}
                        onClick={() => addRows(missing)}
                    />
                )}
                <Button icon={AddIcon} mode="ghost" disabled={readOnly} text="Add row" onClick={() => addRows([''])} />
            </Flex>
        </Stack>
    )
}
