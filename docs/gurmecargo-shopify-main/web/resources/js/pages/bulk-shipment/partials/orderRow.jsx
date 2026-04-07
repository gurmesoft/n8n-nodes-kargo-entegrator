import React from "react";
import {
    IndexTable,
    Text,
    Spinner,
    Icon,
    Tooltip,
    InlineStack,
} from "@shopify/polaris";
import { CheckIcon, AlertTriangleIcon } from "@shopify/polaris-icons";
import { EditableCell, AddressEditableCell } from "./cellComponent";

const OrderRow = ({
    id,
    order,
    name,
    surname,
    number,
    city,
    district,
    address,
    index,
    loadingStatus,
    handleMouseEnter,
    handleMouseLeave,
    editMode,
    hoveredCell,
    handleEditClick,
    handleChange,
    handleBlur,
    orderData,
    handleAiChange,
    errorMessage,
    desi,
    package_count,
}) => (
    <IndexTable.Row
        key={id}
        id={id}
        position={index}
        onMouseEnter={() => handleMouseEnter(id, "field")}
        onMouseLeave={handleMouseLeave}
    >
        <IndexTable.Cell>
            {loadingStatus[id].creating && (
                <Text>
                    <Spinner size="small" />
                </Text>
            )}
            {loadingStatus[id].created && (
                <Icon source={CheckIcon} tone="success" />
            )}
            {loadingStatus[id].error && (
                <Tooltip content={errorMessage}>
                    <Icon source={AlertTriangleIcon} tone="critical" />
                </Tooltip>
            )}
            {loadingStatus[id].empty && <Text>-</Text>}
        </IndexTable.Cell>
        <IndexTable.Cell>{order}</IndexTable.Cell>
        <IndexTable.Cell>
            <EditableCell
                id={id}
                field="name"
                value={name}
                editMode={editMode}
                hoveredCell={hoveredCell}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleEditClick={handleEditClick}
                handleChange={handleChange}
                handleBlur={handleBlur}
            />
        </IndexTable.Cell>
        <IndexTable.Cell>
            <EditableCell
                id={id}
                field="surname"
                value={surname}
                editMode={editMode}
                hoveredCell={hoveredCell}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleEditClick={handleEditClick}
                handleChange={handleChange}
                handleBlur={handleBlur}
            />
        </IndexTable.Cell>
        <IndexTable.Cell>
            <EditableCell
                id={id}
                field="phone"
                value={number}
                editMode={editMode}
                hoveredCell={hoveredCell}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleEditClick={handleEditClick}
                handleChange={handleChange}
                handleBlur={handleBlur}
            />
        </IndexTable.Cell>
        <IndexTable.Cell>
            <AddressEditableCell
                id={id}
                field="city"
                value={city}
                editMode={editMode}
                hoveredCell={hoveredCell}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleEditClick={handleEditClick}
                handleChange={handleChange}
                handleBlur={handleBlur}
                orderData={orderData}
                handleAiChange={handleAiChange}
            />
        </IndexTable.Cell>
        <IndexTable.Cell>
            <AddressEditableCell
                id={id}
                field="district"
                value={district}
                editMode={editMode}
                hoveredCell={hoveredCell}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleEditClick={handleEditClick}
                handleChange={handleChange}
                handleBlur={handleBlur}
                orderData={orderData}
                handleAiChange={handleAiChange}
            />
        </IndexTable.Cell>
        <IndexTable.Cell>
            <AddressEditableCell
                id={id}
                field="address"
                value={address}
                editMode={editMode}
                hoveredCell={hoveredCell}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleEditClick={handleEditClick}
                handleChange={handleChange}
                handleBlur={handleBlur}
                orderData={orderData}
                handleAiChange={handleAiChange}
            />
        </IndexTable.Cell>
        <IndexTable.Cell>
            <EditableCell
                id={id}
                field="desi"
                value={desi}
                editMode={editMode}
                hoveredCell={hoveredCell}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleEditClick={handleEditClick}
                handleChange={handleChange}
                handleBlur={handleBlur}
            />
        </IndexTable.Cell>
        <IndexTable.Cell>
            <InlineStack align="end">
                <EditableCell
                    id={id}
                    field="package_count"
                    value={package_count}
                    editMode={editMode}
                    hoveredCell={hoveredCell}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                    handleEditClick={handleEditClick}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                />
            </InlineStack>
        </IndexTable.Cell>
    </IndexTable.Row>
);

export default OrderRow;
