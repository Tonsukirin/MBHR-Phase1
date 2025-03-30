'use client';

import { CustomButton } from '@/components/Buttons';
import { CreateContactPersonModal, EditInfoModal } from '@/components/Modal';
import EditContactPersonModal from '@/components/Modal/EditContactPersonModal';
import { HolidayTable } from '@/components/Table/HolidayTable';
import {
  addContactPerson,
  deleteClient,
  deleteContactPerson,
  getClientById,
  updateContactPerson,
} from '@/services/Client';
import { updateClient } from '@/services/Client/updateClient';
import {
  ArrowLeftOutlined,
  EditOutlined,
  MailOutlined,
  MessageOutlined,
  PhoneOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Card,
  Divider,
  Empty,
  Modal,
  Popconfirm,
  Spin,
  Table,
} from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ClientsResponse,
  UpdateClientRequest,
} from '../../../../../backend/Client/client';
import { ClientContactPersonBase } from '../../../../../backend/Client/contactPerson';

const ClientOverview = ({ params }: { params: { id: number } }) => {
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState<ClientsResponse | null>(null);
  const [selectClientData, setSelectedClientData] =
    useState<ClientsResponse | null>(null);
  const [editInfoModalOpen, setEditInfoModalOpen] = useState(false);
  const [createContactPersonModal, setCreateContactPersonModal] =
    useState(false);
  const [editContactPersonModal, setEditContactPersonModal] = useState(false);
  const [selectedContactPerson, setSelectedContactPerson] = useState<{
    index: number;
    data: ClientContactPersonBase;
  } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const cardSectionRef = useRef<HTMLDivElement>(null);

  const clientFullAddress = () => {
    if (!clientData?.address) return '';
    const {
      houseNumber,
      village,
      moo,
      alley,
      street,
      subDistrict,
      district,
      province,
      postalCode,
    } = clientData.address;

    const line1 = [houseNumber, village, moo, alley, street]
      .filter(Boolean)
      .join(' ');
    const line2 = [subDistrict, district, province, postalCode]
      .filter(Boolean)
      .join(', ');

    return [line1, line2].filter(Boolean).join(', ');
  };

  const transformToUpdateFormat = (clientData: ClientsResponse | null) => {
    const transformedData = {
      client: {
        shownClientId: clientData?.shownClientId,
        name: clientData?.name,
        industry: clientData?.industry,
        registeredCapital: clientData?.registeredCapital,
      },
      address: {
        houseNumber: clientData?.address.houseNumber,
        building: clientData?.address.building,
        floor: clientData?.address.floor,
        alley: clientData?.address.alley,
        subDistrict: clientData?.address.subDistrict,
        district: clientData?.address.district,
        province: clientData?.address.province,
        postalCode: clientData?.address.postalCode,
      },
    };
    return transformedData;
  };

  const getChangedFields = (newValues: any, originalValues: any): any => {
    if (typeof newValues !== 'object' || newValues === null) {
      return newValues !== originalValues ? newValues : undefined;
    }

    const diff: any = {};
    let hasDiff = false;

    for (const key in newValues) {
      const newVal = newValues[key];
      const origVal = originalValues ? originalValues[key] : undefined;
      const changed = getChangedFields(newVal, origVal);

      if (changed !== undefined) {
        diff[key] = changed;
        hasDiff = true;
      }
    }

    return hasDiff ? diff : undefined;
  };

  const handleModalSubmit = async (values: UpdateClientRequest) => {
    const changedFieldsPayload = getChangedFields(
      values,
      transformToUpdateFormat(clientData)
    );

    if (changedFieldsPayload === undefined) {
      console.log('no changes');
      setEditInfoModalOpen(false);
      setSelectedClientData(null);
      return;
    } else {
      setEditInfoModalOpen(false);
      console.log('changed fields: ', changedFieldsPayload);
      const response = await updateClient(id, values);
      await fetchClientData();
      console.log('Form Submitted: ', response);
      setSelectedClientData(null);
    }
  };

  const handleCreateContactPersonModalSubmit = async (
    values: ClientContactPersonBase
  ) => {
    setCreateContactPersonModal(false);
    const response = await addContactPerson(id, values);
    await fetchClientData();
    console.log('Contact Person Created: ', response);
  };

  const handleEditContactPersonModalSubmit = async (
    values: ClientContactPersonBase,
    index: number
  ) => {
    setEditContactPersonModal(false);
    const response = await updateContactPerson(id, values, index);
    await fetchClientData();
    console.log('Contact Person Editted: ', response);
  };

  const handleDeleteContactPerson = async (index: number) => {
    const response = await deleteContactPerson(id, index);
    await fetchClientData();
    console.log('Contact Deleted: ', response);
  };

  const handleConfirmDelete = async () => {
    setIsModalVisible(false);
    console.log('delete client: ', id);
    await deleteClient(id);
    router.push('/dashboard/client-management');
  };

  const handleCancelDelete = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const preventVerticalScroll = (event: WheelEvent) => {
      if (cardSectionRef.current) {
        const cardSection = cardSectionRef.current;
        const { scrollLeft, scrollWidth, clientWidth } = cardSection;

        const isScrollableLeft = event.deltaY < 0 && scrollLeft > 0;
        const isScrollableRight =
          event.deltaY > 0 && scrollLeft + clientWidth < scrollWidth;

        event.preventDefault();

        if (isScrollableLeft || isScrollableRight) {
          event.preventDefault();
          cardSection.scrollLeft += event.deltaY;
        }
      }
    };

    const preventNavigation = (event: PopStateEvent) => {
      if (
        cardSectionRef.current &&
        document.activeElement === cardSectionRef.current
      ) {
        event.preventDefault();
        history.pushState(null, '', window.location.href); // Prevent accidental navigation
      }
    };

    const cardSection = cardSectionRef.current;
    if (cardSection) {
      cardSection.addEventListener('wheel', preventVerticalScroll, {
        passive: false,
      });
    }

    return () => {
      if (cardSection) {
        cardSection.removeEventListener('wheel', preventVerticalScroll);
        window.removeEventListener('popstate', preventNavigation);
      }
    };
  }, []);

  const fetchClientData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getClientById(id);
      console.log(response);
      console.log(response.data);
      setClientData(response.data);
    } catch (error) {
      console.error('Error fetching client data: ', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClientData();
  }, [id, fetchClientData]);

  return (
    <div className="flex flex-col justify-between h-full">
      {loading ? (
        <Spin
          tip="Loading..."
          className="flex fixed top-0 left-20 w-full h-full justify-center items-center"
        />
      ) : (
        <div className="flex flex-col gap-6 h-full">
          <Breadcrumb
            items={[
              {
                title: 'หน้าหลัก',
                href: '/dashboard',
              },
              {
                title: 'จัดการหน่วยงาน',
              },
              {
                title: 'รายชื่อหน่วยงาน',
                href: '/dashboard/client-management',
              },
              {
                title: `${clientData?.name || id}`,
              },
            ]}
          />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <ArrowLeftOutlined
                onClick={() => router.push('/dashboard/client-management')}
              />
              <span className="font-semibold text-20">
                {clientData?.name}
                <span className="font-normal text-[#6B6B6B]">
                  {' '}
                  ({clientData?.shownClientId})
                </span>
              </span>
            </div>
            <Button
              color="danger"
              variant="filled"
              shape="circle"
              onClick={() => setIsModalVisible(true)}
              className="w-[38px] h-[38px]"
            >
              <Image
                alt="deleteIcon"
                src={'/img/delete-icon.svg'}
                width={14}
                height={14}
                className="object-contain"
              />
            </Button>
          </div>

          <div
            className="w-full overflow-y-auto"
            style={{
              maxHeight: 'calc(100vh - 140px)',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* ข้อมูลทั่วไป header */}
            <div className="flex-1 px-[24px] pr-[40px] pb-10 ">
              <div className="flex flex-col gap-y-6">
                <section className="flex gap-2">
                  <header className="text-16 font-semibold">
                    ข้อมูลทั่วไป
                  </header>
                  <EditOutlined
                    className="text-inactive"
                    onClick={() => {
                      setEditInfoModalOpen(true);
                      setSelectedClientData(clientData);
                    }}
                  />
                  <EditInfoModal
                    open={editInfoModalOpen}
                    clientInfo={selectClientData}
                    onCancel={() => {
                      setEditInfoModalOpen(false);
                      setSelectedClientData(null);
                    }}
                    onSubmit={handleModalSubmit}
                  />
                </section>
                {/* image and info box */}
                <div className="flex gap-[60px] w-full">
                  {/* Placeholder for the image */}
                  <Image
                    width={120}
                    height={120}
                    alt="unitPicture"
                    loading="lazy"
                    src={'/img/image-placeholder.svg'}
                    className="rounded-full"
                  />

                  <section className="flex flex-col gap-6">
                    <div className="flex gap-10">
                      <div className="flex flex-col gap-6 w-full">
                        <div className="flex gap-[40px] w-[420px]">
                          <div className="text-14 text-inactive min-w-[120px]">
                            รหัสหน่วยงาน
                          </div>
                          <div>{clientData?.shownClientId || 'N/A'}</div>
                        </div>
                        <div className="flex gap-[40px] w-[420px]">
                          <div className="text-14 text-inactive min-w-[120px]">
                            ประเภทหน่วยงาน
                          </div>
                          <div>{clientData?.industry || 'N/A'}</div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-6 w-full">
                        <div className="flex gap-[40px] w-[320px">
                          <div className="text-14 text-inactive min-w-[80px]">
                            ชื่อหน่วยงาน
                          </div>
                          <div>{clientData?.name || 'N/A'}</div>
                        </div>
                        <div className="flex gap-[40px] items-center w-[320px">
                          <div className="text-14 text-inactive min-w-[80px]">
                            ทุนจดทะเบียน
                          </div>
                          <div>
                            {clientData?.registeredCapital
                              ? `${clientData.registeredCapital.toLocaleString()} บาท`
                              : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex gap-[40px]">
                      <div className="text-14 text-inactive min-w-[120px]">
                        ที่อยู่ในการส่งเอกสาร
                      </div>
                      <div>{clientFullAddress() || 'N/A'}</div>
                    </div>
                  </section>
                </div>

                <Divider />

                <div className="flex justify-between items-center">
                  <header className="text-16 font-semibold">
                    ลูกค้าที่ติดต่อ
                  </header>
                  <CustomButton
                    icon={<PlusCircleOutlined />}
                    theme="secondary"
                    className="w-[143px] h-[38px]"
                    onClick={() => setCreateContactPersonModal(true)}
                  >
                    เพิ่มรายการใหม่
                  </CustomButton>
                  <CreateContactPersonModal
                    open={createContactPersonModal}
                    onSubmit={handleCreateContactPersonModalSubmit}
                    onCancel={() => setCreateContactPersonModal(false)}
                  />
                </div>
                <div
                  className=" flex gap-6 overflow-x-auto pb-4"
                  ref={cardSectionRef}
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarGutter: 'stable',
                    msOverflowStyle: 'none',
                  }}
                  onWheel={e => {
                    if (cardSectionRef.current) {
                      cardSectionRef.current.scrollLeft += e.deltaY;
                    }
                  }}
                >
                  {clientData?.contactPerson.map(
                    (item: ClientContactPersonBase, index: number) => (
                      <Card
                        key={index}
                        className="min-w-[320px] min-h-[132px] px-3"
                      >
                        <div className="flex flex-col gap-[4px]">
                          <div className="flex justify-between">
                            <p className="text-16 font-medium truncate max-w-[200px]">
                              {item.name}
                              {item.detail ? (
                                <span className="ml-[8px] text-16 text-disable font-normal">{`(${item.detail})`}</span>
                              ) : (
                                <></>
                              )}
                            </p>
                            <div className="flex gap-3">
                              <EditOutlined
                                className="text-16 text-inactive cursor-pointer"
                                onClick={() => {
                                  setSelectedContactPerson({
                                    index,
                                    data: item,
                                  });
                                  setEditContactPersonModal(true);
                                }}
                              />
                              <Popconfirm
                                title="คุณแน่ใจหรือไม่ที่จะลบ?"
                                okText="ตกลง"
                                cancelText="ยกเลิก"
                                cancelButtonProps={{
                                  className: 'custom-cancel-button',
                                }}
                                okButtonProps={{
                                  style: {
                                    backgroundColor: '#F9991E',
                                    borderColor: '#F48625',
                                    color: 'white',
                                  },
                                  className: 'custom-ok-button',
                                }}
                                onConfirm={() =>
                                  handleDeleteContactPerson(index)
                                }
                              >
                                <Image
                                  src={'/img/delete-icon.svg'}
                                  alt="delete"
                                  width={16}
                                  height={16}
                                  className="cursor-pointer"
                                />
                              </Popconfirm>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center mt-[4px]">
                            <PhoneOutlined className="text-16 text-disable" />
                            <p>{item.phone}</p>
                          </div>
                          {item.lineID ? (
                            <div className="flex gap-2 items-center">
                              <MessageOutlined className="text-16 text-disable" />
                              <p>{item.lineID}</p>
                            </div>
                          ) : (
                            <></>
                          )}
                          {item.email ? (
                            <div className="flex gap-2 items-center">
                              <MailOutlined className="text-16 text-disable" />
                              <p>{item.email}</p>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </Card>
                    )
                  )}
                  <EditContactPersonModal
                    open={editContactPersonModal}
                    contactPerson={selectedContactPerson}
                    onSubmit={handleEditContactPersonModalSubmit}
                    onCancel={() => {
                      setEditContactPersonModal(false);
                      setSelectedContactPerson(null);
                    }}
                    onDelete={index => {
                      handleDeleteContactPerson(index);
                      setEditContactPersonModal(false);
                      setSelectedContactPerson(null);
                    }}
                  />
                </div>

                <Divider />

                <div className="flex justify-between items-center">
                  <header className="text-16 font-semibold">
                    สัญญางานจ้าง
                  </header>
                  <CustomButton
                    icon={<PlusCircleOutlined />}
                    theme="primary"
                    onClick={() =>
                      router.push(
                        `/dashboard/client-management/${clientData?.id}/create-contract?id=${clientData?.id}`
                      )
                    }
                    className="w-[143px] h-[38px]"
                  >
                    สร้างสัญญาใหม่
                  </CustomButton>
                </div>
                <Table
                  // need to fix the border
                  showHeader={false}
                  bordered
                  locale={{
                    emptyText: (
                      <Empty
                        style={{ paddingTop: 24, paddingBottom: 24 }}
                        description={
                          <div className="flex flex-col gap-2 text-[#6B6B6B]">
                            <p>ยังไม่มีข้อมูลสัญญางานจ้าง</p>
                            <p>
                              กรุณาสร้างรายการวันหยุดในส่วนด้านล่างก่อน
                              เพื่อสร้างสัญญาต่อ
                            </p>
                          </div>
                        }
                      />
                    ),
                  }}
                />

                <Divider />

                <section className="flex gap-2">
                  <header className="text-16 font-semibold">
                    วันหยุดนักขัตฤกษ์
                  </header>
                  <EditOutlined
                    className="text-inactive"
                    onClick={() => console.log('editted click')}
                  />
                </section>
                <HolidayTable />
              </div>
            </div>
          </div>

          <Modal
            title={
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: 'semibold',
                  paddingBottom: '16px',
                }}
              >
                คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลหน่วยงาน
              </div>
            }
            open={isModalVisible}
            onCancel={handleCancelDelete}
            closeIcon={false}
            footer={[
              <div className="flex justify-center gap-10" key="footer">
                <CustomButton
                  key="stay"
                  theme="flat"
                  onClick={handleCancelDelete}
                  className="h-[46px] w-[111px]"
                >
                  ยกเลิก
                </CustomButton>
                <CustomButton
                  key="leave"
                  theme="primary"
                  onClick={handleConfirmDelete}
                  className="h-[46px] w-[111px]"
                >
                  ยืนยัน
                </CustomButton>
              </div>,
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default ClientOverview;
