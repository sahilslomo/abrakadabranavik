"use client";

import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  Plus,
  Trash2,
  BookOpen,
  CircleHelp,
} from "lucide-react";

export default function AdminPage() {
  const [classId, setClassId] =
    useState("class2");

  const [functionId, setFunctionId] =
    useState("fn3");

  const [topicTitle, setTopicTitle] =
    useState("");

  const [topicDesc, setTopicDesc] =
    useState("");

  const [topics, setTopics] = useState<any[]>([]);

  const [selectedTopic, setSelectedTopic] =
    useState("");

  const [question, setQuestion] =
    useState("");

  const [questions, setQuestions] =
    useState<any[]>([]);

  /* =========================
     LOAD TOPICS
  ========================= */

  const fetchTopics = async () => {
    const snapshot = await getDocs(
      collection(db, "topics")
    );

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setTopics(data);
  };

  /* =========================
     LOAD QUESTIONS
  ========================= */

  const fetchQuestions = async () => {
    const snapshot = await getDocs(
      collection(db, "questions")
    );

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setQuestions(data);
  };

  useEffect(() => {
    fetchTopics();
    fetchQuestions();
  }, []);

  /* =========================
     ADD TOPIC
  ========================= */

  const handleAddTopic = async () => {
    if (!topicTitle) {
      alert("Enter topic title");
      return;
    }

    await addDoc(collection(db, "topics"), {
      classId,
      functionId,
      title: topicTitle,
      description: topicDesc,
    });

    setTopicTitle("");
    setTopicDesc("");

    fetchTopics();

    alert("Topic Added");
  };

  /* =========================
     ADD QUESTION
  ========================= */

  const handleAddQuestion = async () => {
    if (!selectedTopic || !question) {
      alert("Fill all fields");
      return;
    }

    await addDoc(collection(db, "questions"), {
      topicId: selectedTopic,
      question,
    });

    setQuestion("");

    fetchQuestions();

    alert("Question Added");
  };

  /* =========================
     DELETE TOPIC
  ========================= */

  const handleDeleteTopic = async (
    id: string
  ) => {
    await deleteDoc(doc(db, "topics", id));

    fetchTopics();
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] p-5">

      <div className="max-w-md mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          NAVIK Admin
        </h1>

        {/* =========================
            ADD TOPIC
        ========================= */}

        <div className="bg-white rounded-3xl p-5 mb-8 border border-gray-200">

          <div className="flex items-center gap-2 mb-5">
            <BookOpen size={20} />
            <h2 className="text-xl font-bold">
              Add Topic
            </h2>
          </div>

          <div className="space-y-4">

            <select
              value={classId}
              onChange={(e) =>
                setClassId(e.target.value)
              }
              className="w-full border rounded-2xl p-4"
            >
              <option value="class2">
                Class 2
              </option>

              <option value="class4">
                Class 4
              </option>
            </select>

            <select
              value={functionId}
              onChange={(e) =>
                setFunctionId(e.target.value)
              }
              className="w-full border rounded-2xl p-4"
            >
              <option value="fn3">FN3</option>
              <option value="fn4b">FN4B</option>
              <option value="fn5">FN5</option>
              <option value="fn6">FN6</option>
            </select>

            <input
              type="text"
              placeholder="Topic title"
              value={topicTitle}
              onChange={(e) =>
                setTopicTitle(e.target.value)
              }
              className="w-full border rounded-2xl p-4"
            />

            <textarea
              placeholder="Description"
              value={topicDesc}
              onChange={(e) =>
                setTopicDesc(e.target.value)
              }
              className="w-full border rounded-2xl p-4"
            />

            <button
              onClick={handleAddTopic}
              className="w-full bg-black text-white rounded-2xl p-4 flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add Topic
            </button>

          </div>
        </div>

        {/* =========================
            ADD QUESTION
        ========================= */}

        <div className="bg-white rounded-3xl p-5 mb-8 border border-gray-200">

          <div className="flex items-center gap-2 mb-5">
            <CircleHelp size={20} />
            <h2 className="text-xl font-bold">
              Add Question
            </h2>
          </div>

          <div className="space-y-4">

            <select
              value={selectedTopic}
              onChange={(e) =>
                setSelectedTopic(e.target.value)
              }
              className="w-full border rounded-2xl p-4"
            >
              <option value="">
                Select Topic
              </option>

              {topics.map((topic) => (
                <option
                  key={topic.id}
                  value={topic.id}
                >
                  {topic.title}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Enter question"
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              className="w-full border rounded-2xl p-4"
            />

            <button
              onClick={handleAddQuestion}
              className="w-full bg-black text-white rounded-2xl p-4"
            >
              Add Question
            </button>

          </div>
        </div>

        {/* =========================
            TOPICS LIST
        ========================= */}

        <div className="space-y-4">

          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-3xl p-5 border border-gray-200"
            >

              <div className="flex justify-between mb-3">

                <div>
                  <h3 className="font-bold text-lg">
                    {topic.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {topic.classId} •{" "}
                    {topic.functionId}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleDeleteTopic(topic.id)
                  }
                >
                  <Trash2 size={18} />
                </button>

              </div>

              <p className="text-sm text-gray-600">
                {topic.description}
              </p>

            </div>
          ))}

        </div>
      </div>
    </main>
  );
}