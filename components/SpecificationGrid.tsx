import React, {useCallback, useEffect, useState} from 'react'
import {ArrayOfObjectsInputProps, PatchEvent, set, useClient, useFormValue} from 'sanity'
import {Stack, Grid, TextInput, Text, Card, Label} from '@sanity/ui'

interface Specification {
    _key: string
    label: string
    value: string
}

export function SpecificationGrid(props: ArrayOfObjectsInputProps) {
    const {value = [], onChange} = props
    const client = useClient({apiVersion: '2023-01-01'})
    
    // Get template ref from product or category
    const templateRef = useFormValue(['specificationTemplate']) as {_ref: string} | undefined
    const categoryRef = useFormValue(['category']) as {_ref: string} | undefined
    
    const [templateFields, setTemplateFields] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchTemplate() {
            let finalTemplateId = templateRef?._ref

            if (!finalTemplateId && categoryRef?._ref) {
                // If no direct template, check category
                const category = await client.fetch(`*[_id == $id][0]{specificationTemplate}`, {id: categoryRef._ref})
                finalTemplateId = category?.specificationTemplate?._ref
            }

            if (finalTemplateId) {
                setLoading(true)
                try {
                    const template = await client.fetch(`*[_id == $id][0]{fields}`, {id: finalTemplateId})
                    if (template?.fields) {
                        setTemplateFields(template.fields)
                    }
                } finally {
                    setLoading(false)
                }
            } else {
                setTemplateFields([])
            }
        }

        fetchTemplate()
    }, [templateRef, categoryRef, client])

    const handleValueChange = useCallback(
        (label: string, newValue: string) => {
            const castValue = value as Specification[]
            const existingIndex = castValue.findIndex((item) => item.label === label)
            const nextValue = [...castValue]

            if (existingIndex > -1) {
                nextValue[existingIndex] = {...nextValue[existingIndex], value: newValue}
            } else {
                nextValue.push({
                    _key: Math.random().toString(36).substring(2),
                    label,
                    value: newValue,
                })
            }

            onChange(PatchEvent.from(set(nextValue)))
        },
        [value, onChange]
    )

    if (loading) return <Text>Loading specifications template...</Text>

    // If no template fields, render the default input (or a message)
    if (templateFields.length === 0) {
        return (
            <Stack space={3}>
                <Text size={1} muted>
                    No specification template selected (directly or via category). 
                    Please select a template to see the structured grid.
                </Text>
                {props.renderDefault(props)}
            </Stack>
        )
    }

    return (
        <Stack space={3}>
            <Grid columns={[1, 1, 2]} gap={3}>
                {templateFields.map((field) => {
                    const item = (value as Specification[]).find((v) => v.label === field)
                    return (
                        <Card key={field} border padding={3} radius={2}>
                            <Stack space={2}>
                                <Label size={1}>{field}</Label>
                                <TextInput
                                    value={item?.value || ''}
                                    onChange={(event) => handleValueChange(field, event.currentTarget.value)}
                                    placeholder={`Enter ${field.toLowerCase()}...`}
                                />
                            </Stack>
                        </Card>
                    )
                })}
            </Grid>
            
            <Stack space={3} marginTop={4}>
                <Label size={1} muted>Other Specifications</Label>
                {props.renderDefault(props)}
            </Stack>
        </Stack>
    )
}
